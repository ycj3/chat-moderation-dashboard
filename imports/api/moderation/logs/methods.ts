import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ModerationLog } from '/imports/types/ModerationLog';
import { ModerationLogs } from './collection';

Meteor.methods({
  async 'moderationlogs.insert'(log: ModerationLog) {
    check(log, Object);
    log.createdAt = new Date();
    return ModerationLogs.insertAsync(log);
  },
  async 'moderationlogs.clear'() {
    return ModerationLogs.removeAsync({});
  },
  async 'moderationlogs.count'() {
    return ModerationLogs.find().countAsync();
  }
});