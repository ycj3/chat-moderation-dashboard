import { ModerationPolicies } from "./policies/collection";
import { ModerationLogs } from "./logs/collection";
import { getValueByField } from "/server/utils/objectUtils";

import { logDev } from "/imports/utils/logger";
import { AzureTextModerationProvider } from "./providers/azure/text";
import { AgoraChatCallbackPayload } from "../../types/AgoraChat";
import { isTextMessage, isCustomMessage } from "/imports/utils/typeGuards";

export async function runModeration(body: AgoraChatCallbackPayload) {
  const { msg_id, from, to, chat_type, payload } = body;
  const messageBody = payload?.bodies?.[0] || {};
  const messageType = messageBody.type || "txt";
  const policies = await ModerationPolicies.findOneAsync({ type: messageType });

  const response: any = {
    valid: true,
    code: "",
    payload: { msg_id, from, to, chat_type, bodies: [messageBody] },
  };

  logDev("Moderation Policies", policies);
  if (!policies || policies.action === "No Action") return response;

  let content: string | undefined;

  if (isTextMessage(messageBody)) {
    content = messageBody.msg;
  } else if (isCustomMessage(messageBody)) {
    content = getValueByField(
      messageBody.customExts?.[0] || {},
      policies.customField || ""
    );
  }

  if (!content) return response;

  const azureProvider = AzureTextModerationProvider;
  const result = await azureProvider.moderateText(content);

  await ModerationLogs.insertAsync({
    msgId: msg_id,
    from,
    to,
    chatType: chat_type,
    messageType,
    content,
    provider: azureProvider.name,
    feature: "text",
    result: result.normalized,
    action: "TODO: determine action based on result",
    createdAt: new Date(),
    updatedAt: new Date(),
    rawResponse: body,
  });
  logDev("Moderation Result", result);
  return response;
}
