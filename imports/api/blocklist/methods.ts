import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Blocklist } from './collection';

Meteor.methods({
  async 'blocklist.insert'(word, category) {
    console.log('Insert called with:', word, category);
    check(word, String);
    check(category, String);
    await Blocklist.insertAsync({ word, category, createdAt: new Date() });
  },

  async 'blocklist.remove'(id) {
    check(id, String);
    await Blocklist.removeAsync(id);
  },
});