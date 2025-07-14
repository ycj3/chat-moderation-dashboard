import { Meteor } from "meteor/meteor";
import { Blocklist } from './collection';

// Publish the blocklist collection
Meteor.publish("blocklist", function () {
    return Blocklist.find({}, { fields: { word: 1, category: 1, createdAt: 1 } });
});