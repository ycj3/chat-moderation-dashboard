import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { ModerationAction } from '/imports/types/ModerationPolicy';
import { ModerationPolicies } from './collection';

Meteor.methods({
  async 'moderation.getPolicies'() {
    const policies = ModerationPolicies.find({}, {
      fields: {
        type: 1,
        action: 1,
        customField: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    });
    return policies.map(p => ({
      type: p.type,
      action: p.action,
      customField: p.customField || "",
      createdAt: p.createdAt ? p.createdAt.toISOString() : null,
      updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
    }));
  },

  async 'moderation.setPolicy'({ type, action }: { type: string; action: ModerationAction }) {
    check(type, String);
    check(action, Match.OneOf(
      ModerationAction.NoAction,
      ModerationAction.Replace,
      ModerationAction.Block,
    ));
    return ModerationPolicies.upsertAsync({ type }, { $set: { action, updatedAt: new Date } });
  },

  async 'moderation.setPolicyCustomField'({ type, customField }) {
    check(type, String);
    check(customField, String);
    ModerationPolicies.upsertAsync({ type }, { $set: { customField } });
  },
});