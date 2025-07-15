import { WebApp } from 'meteor/webapp';
import bodyParser from 'body-parser';
import { ModerationPolicies } from '/imports/api/moderation/policies/collection';
import { hasBlockedWords, replaceBlockedWords } from '/imports/api/blocklist/service';
import { logDev } from '/imports/utils/logger';

const jsonParser = bodyParser.json();

// Helper: Safely get the value from an object by a dot-separated path.
function getValueByPath(obj: string, pathStr: string) {
    const path = pathStr.split('.');
    let current = obj;
    for (const key of path) {
        if (current == null || typeof current !== 'object') return undefined;
        current = current[key];
    }
    return current;
}


// Helper: Safely set the value into an object by a dot-separated path.
function setValueByPath(obj: any, pathStr: string, value: string) {
    const path = pathStr.split('.');
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    const lastKey = path[path.length - 1];
    current[lastKey] = value;
}

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
            content = getValueByPath(messageBody.customExts?.[0] || {}, policies.fields?.[0] || '');
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
                setValueByPath(messageBody.customExts?.[0] || {}, policies.fields?.[0] || '', result.updatedText);
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
