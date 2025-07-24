export interface AgoraChatCallbackPayload {
  callId: string;
  timestamp: number;
  // chat: One-to-one chats.
  // groupchat: Chat groups and chat rooms.
  chat_type: ChatType;
  from: string;
  to: string;
  msg_id: string;
  payload: {
    bodies: AgoraChatMessageBody[];
    ext: Record<string, any>;
    from: string;
    meta: Record<string, any>;
    to: string;
    type: ChatType;
  };
  security: string;
  app_id: string;
}

// Base interface for all message bodies
export interface BaseMessageBody {
  type: string;
}

// Text message structure
export interface TextMessageBody extends BaseMessageBody {
  type: "txt";
  msg: string;
}

// Custom message structure
export interface CustomMessageBody extends BaseMessageBody {
  type: "custom";
  customEvent?: string;
  customExts?: Array<Record<string, any>>;
  "v2:customExts"?: Record<string, any>;
}
// Union type of all supported message types
export type AgoraChatMessageBody = TextMessageBody | CustomMessageBody;

export type ChatType = "chat" | "groupchat" | "chatroom";
