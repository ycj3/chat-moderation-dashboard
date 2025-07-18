import { Mongo } from 'meteor/mongo';
import { ModerationLog } from '/imports/types/ModerationLog';


export const ModerationLogs = new Mongo.Collection<ModerationLog>('moderation_logs');