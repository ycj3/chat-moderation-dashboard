import type {
  AgoraChatMessageBody,
  TextMessageBody,
  CustomMessageBody,
} from "../types/AgoraChat";

// Guard for text message
export function isTextMessage(
  body: AgoraChatMessageBody
): body is TextMessageBody {
  return body.type === "txt";
}

// Guard for custom message
export function isCustomMessage(
  body: AgoraChatMessageBody
): body is CustomMessageBody {
  return body.type === "custom";
}
