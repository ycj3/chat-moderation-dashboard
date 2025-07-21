import { WebApp } from 'meteor/webapp';
import bodyParser from 'body-parser';
import { handleModerationWebhook } from '/imports/api/moderation/service';

const jsonParser = bodyParser.json();
WebApp.handlers.use('/webhook/moderate', jsonParser, handleModerationWebhook);
