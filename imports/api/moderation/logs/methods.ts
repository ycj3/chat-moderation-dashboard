import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { ModerationLog } from "/imports/types/ModerationLog";
import { ModerationLogs } from "./collection";

Meteor.methods({
  async "moderationlogs.insert"(log: ModerationLog) {
    check(log, Object);
    log.createdAt = new Date();
    return ModerationLogs.insertAsync(log);
  },
  async "moderationlogs.clear"() {
    return ModerationLogs.removeAsync({});
  },
  async "moderationlogs.count"() {
    return ModerationLogs.find().countAsync();
  },
  async "moderationLogs.countFiltered"({
    searchText = "",
    chatType,
    action,
  }: {
    searchText?: string;
    chatType?: string;
    action?: string;
  }) {
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

    return ModerationLogs.find(query).countAsync();
  },
});
