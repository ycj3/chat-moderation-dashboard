import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ModerationPolicies } from './collection';

Meteor.methods({
  async 'moderation.getPolicies'() {
    return ModerationPolicies.find({}, { fields: { type: 1, action: 1, fields: 1 } }).fetch();
  },
  async 'moderation.setPolicy'({ type, action }) {
    check(type, String);
    check(action, String);
    return ModerationPolicies.upsertAsync({ type }, { $set: { action } });
  },
  async 'moderation.setPolicyFields'({ type, fields }) {
    check(type, String);
    check(fields, String);
    ModerationPolicies.upsertAsync({ type }, { $set: { fields } });
  },
});