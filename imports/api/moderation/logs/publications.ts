import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { ModerationLogs } from "./collection";

Meteor.publish("moderationLogs.all", function (limit = 50) {
    check(limit, Number);
    return ModerationLogs.find({}, {
        sort: { createdAt: -1 },
        limit: limit,
    });
});
