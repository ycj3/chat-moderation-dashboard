import { ModerationPolicy } from "./ModerationPolicy";
import { AgoraChatCallbackPayload } from "./AgoraChat";

export type ModerationLog = {
  _id?: string;
  callbackPayload: AgoraChatCallbackPayload;
  policy: ModerationPolicy;
  content: string;
  matchedKeywords?: string[];
  createdAt: Date;
};
