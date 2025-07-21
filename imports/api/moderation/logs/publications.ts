import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { ModerationLogs } from "./collection";

Meteor.publish(
  "moderationLogs.filtered",
  function ({
    limit = 10,
    skip = 0,
    searchText = "",
    chatType,
    action,
  }: {
    limit?: number;
    skip?: number;
    searchText?: string;
    chatType?: string;
    action?: string;
  }) {
    check(limit, Number);
    check(skip, Number);
    check(searchText, String);
    check(chatType, Match.Maybe(String));
    check(action, Match.Maybe(String));

    const query: Record<string, any> = {};

    if (chatType) {
      query.chatType = chatType;
    }
    if (action) {
      query.action = action;
    }
    if (searchText) {
      query.$or = [
        { from: new RegExp(searchText, "i") },
        { to: new RegExp(searchText, "i") },
        { content: new RegExp(searchText, "i") },
      ];
    }

    return ModerationLogs.find(query, {
      sort: { createdAt: -1 },
      limit,
      skip,
    });
  }
);
