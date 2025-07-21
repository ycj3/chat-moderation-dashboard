import { ModerationPolicies } from "./policies/collection";
import { ModerationLogs } from "./logs/collection";
import {
  hasBlockedWords,
  replaceBlockedWords,
} from "/imports/api/blocklist/service";
import { getValueByField, setValueByField } from "/server/utils/objectUtils";

import { logDev } from "/imports/utils/logger";

export async function runModeration(body: any) {
  logDev("runModeration", body);
  const { msg_id, from, to, chat_type, payload } = body;
  const messageBody = payload?.bodies?.[0] || {};
  const messageType = messageBody.type || "txt";
  const policies = await ModerationPolicies.findOneAsync({ type: messageType });

  const response: any = {
    valid: true,
    code: "",
    payload: { msg_id, from, to, chat_type, bodies: [messageBody] },
  };

  if (!policies || policies.action === "No Action") return response;

  let content: string | undefined;

  if (messageType === "txt") {
    content = messageBody.msg;
  } else if (messageType === "custom") {
    content = getValueByField(
      messageBody.customExts?.[0] || {},
      policies.customField || ""
    );
  }

  if (!content) return response;

  const blockResult = await hasBlockedWords(content);
  if (blockResult.isExisting) {
    if (policies.action === "Block From Sending") {
      response.valid = false;
      response.code = "This message contains blocked content";
    } else if (policies.action === "Replace With Asterisks (*)") {
      const replaced = await replaceBlockedWords(content);
      if (messageType === "txt") {
        messageBody.msg = replaced.updatedText;
      } else if (messageType === "custom") {
        setValueByField(
          messageBody.customExts?.[0] || {},
          policies.customField || "",
          replaced.updatedText
        );
        setValueByField(
          messageBody["v2:customExts"] || {},
          policies.customField || "",
          replaced.updatedText
        );
      }
      response.payload = body.payload;
    }

    await ModerationLogs.insertAsync({
      msgId: msg_id,
      from,
      to,
      chatType: chat_type,
      messageType,
      content,
      action: policies.action,
      matchedKeywords: blockResult.matchedWords || [],
      createdAt: new Date(),
    });
  }

  return response;
}
