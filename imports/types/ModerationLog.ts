import { AgoraChatCallbackPayload } from "./AgoraChat";
import { NormalizedModerationResult } from "./ModerationResult";

export type ModerationLog = {
  _id?: string;

  // Source message metadata
  msgId: string;
  from: string;
  to: string;
  chatType: "chat" | "groupchat" | "chatroom";
  messageType: "txt" | "custom";
  content: string;

  // Moderation metadata
  provider: string; // e.g., "azure", "ggwp", "openai"
  feature: "text" | "image"; // Which moderation was applied
  result: NormalizedModerationResult;

  // Moderation decision
  action: "allow" | "block" | "review" | string; // Final decision

  //TODO: add policy if needed

  // System metadata
  createdAt: Date;
  updatedAt?: Date;

  // Optional: raw payload for debugging
  rawResponse?: AgoraChatCallbackPayload;
};
