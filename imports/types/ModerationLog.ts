import { ChatType } from "./AgoraChat";

export type ModerationLog = {
  _id?: string;
  msgId: string;
  from: string;
  to: string;
  chatType: ChatType;
  messageType: "txt" | "custom" | string;
  content: string;
  action: "No Action" | "Replace With Asterisks (*)" | "Block From Sending";
  matchedKeywords?: string[];
  createdAt: Date;
};
