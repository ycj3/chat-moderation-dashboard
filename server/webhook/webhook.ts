import { WebApp } from 'meteor/webapp';
import bodyParser from 'body-parser';
import { ModerationPolicies } from '/imports/api/moderation/policies/collection';
import { hasBlockedWords, replaceBlockedWords } from '/imports/api/blocklist/service';
import { logDev } from '/imports/utils/logger';
import { getValueByField, setValueByField } from '../utils/objectUtils';

const jsonParser = bodyParser.json();

WebApp.handlers.use('/webhook/moderate', jsonParser, async (req, res) => {
    if (req.method !== 'POST') {
        res.writeHead(405);
        res.end('Method Not Allowed');
        return;
    }
    try {
        const { msg_id, from, to, chat_type, payload } = req.body;
        const messageBody = payload?.bodies?.[0] || {};

        const messageType = messageBody.type || 'txt';
        const policies = await ModerationPolicies.findOneAsync({ type: messageType });
        logDev('moderation-webhook', 'Moderation policies found', policies);

        const response = { valid: true, code: '', payload: { msg_id, from, to, chat_type, bodies: [messageBody] } };

        if (!policies || policies.action === 'No Action') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
            return;
        }

        let content: string | undefined;
        if (messageType === 'txt') {
            content = messageBody.msg;
        } else if (messageType === 'custom') {
            content = getValueByField(messageBody.customExts?.[0] || {}, policies.customField || '');
        }
        if (!content) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
            return;
        }
        const action = policies.action;

        const result = await hasBlockedWords(content);
        if (content && result) {
            if (action === 'Block From Sending') {
                response.valid = false;
                response.code = "This message contains blocked content";
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
                return;
            }

            if (messageBody.type === 'txt' && action === 'Replace With Asterisks (*)') {
                const result = await replaceBlockedWords(content);
                messageBody.msg = result.updatedText;
                response.payload = payload;
            } else if (messageBody.type === 'custom' && action === 'Replace With Asterisks (*)') {
                const result = await replaceBlockedWords(content);
                setValueByField(messageBody.customExts?.[0] || {}, policies.customField || '', result.updatedText);
                setValueByField(messageBody["v2:customExts"] || {}, policies.customField || '', result.updatedText);
                response.payload = payload;
            }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    } catch (err) {
        res.writeHead(500);
        res.end('Internal Error');
    }
});
