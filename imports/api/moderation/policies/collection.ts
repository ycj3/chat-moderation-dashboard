import { Mongo } from 'meteor/mongo';
import { ModerationPolicy } from '/imports/types/ModerationPolicy';


export const ModerationPolicies = new Mongo.Collection<ModerationPolicy>('moderation_policies');