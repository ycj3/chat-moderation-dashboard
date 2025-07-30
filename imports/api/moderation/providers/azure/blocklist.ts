import { BlocklistCheckProvider } from "../../capabilities/blocklistCheck";
import { ModerationResult } from "/imports/types/ModerationResult";
import { AzureKeyCredential } from "@azure/core-auth";
import ContentSafetyClient, {
  isUnexpected,
  AnalyzeTextResultOutput,
} from "@azure-rest/ai-content-safety";
import { normalizeAzureTextModerationResult } from "./normalize";
export const AzureBlocklistCheckProvider: BlocklistCheckProvider = {
  name: "azure",

  async checkBlocklist(
    text: string,
    blocklistName: string
  ): Promise<ModerationResult> {
    try {
      const result = await analysisTextWithBlocklist(text, blocklistName);
      return {
        raw: result,
        normalized: normalizeAzureTextModerationResult(result),
      };
    } catch (error) {
      console.error("Error analyzing text with Azure Content Safety:", error);
      throw error;
    }
  },
};

async function analysisTextWithBlocklist(
  text: string,
  blocklistName: string
): Promise<AnalyzeTextResultOutput> {
  const endpoint = process.env.CONTENT_SAFETY_ENDPOINT;
  const key = process.env.CONTENT_SAFETY_KEY;

  if (!endpoint || !key) {
    throw new Error(
      "Missing required environment variables: CONTENT_SAFETY_ENDPOINT or CONTENT_SAFETY_KEY"
    );
  }

  const credential = new AzureKeyCredential(key);
  const client = ContentSafetyClient(endpoint, credential);
  const analyzeTextParameters = {
    body: {
      text: text,
      blocklistNames: [blocklistName],
      haltOnBlocklistHit: false,
    },
  };

  const result = await client.path("/text:analyze").post(analyzeTextParameters);

  if (isUnexpected(result)) {
    throw result;
  }

  return result.body;
}
