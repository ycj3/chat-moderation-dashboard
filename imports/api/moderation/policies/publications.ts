import { Meteor } from "meteor/meteor";
import { ModerationPolicies } from "./collection";

// Publish the blocklist collection
Meteor.publish("moderation_policies", function () {
    return ModerationPolicies.find({}, {
        fields: {
            type: 1,
            action: 1,
            fields: 1
        }
    });
});