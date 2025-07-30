import ContentSafetyClient, {
  isUnexpected,
  AnalyzeTextParameters,
  AnalyzeText200Response,
  AnalyzeTextDefaultResponse,
  AnalyzeTextOptions,
  TextCategoriesAnalysisOutput,
} from "@azure-rest/ai-content-safety";
import { AzureKeyCredential } from "@azure/core-auth";

/**
 * Analyze whether a piece of text contains harmful content.
 * @param text The text content to analyze
 * @returns Array of analysis results (category and severity)
 */
async function analyzeText(
  text: string
): Promise<TextCategoriesAnalysisOutput[]> {
  const endpoint = process.env.CONTENT_SAFETY_ENDPOINT;
  const key = process.env.CONTENT_SAFETY_KEY;

  if (!endpoint || !key) {
    throw new Error(
      "Missing required environment variables: CONTENT_SAFETY_ENDPOINT or CONTENT_SAFETY_KEY"
    );
  }

  const credential = new AzureKeyCredential(key);
  const client = ContentSafetyClient(endpoint, credential);

  const analyzeTextOption: AnalyzeTextOptions = { text };
  const analyzeTextParameters: AnalyzeTextParameters = {
    body: analyzeTextOption,
  };

  const result: AnalyzeText200Response | AnalyzeTextDefaultResponse =
    await client.path("/text:analyze").post(analyzeTextParameters);

  if (isUnexpected(result)) {
    throw new Error(
      `Unexpected error from Azure Content Safety API: ${result.status}`
    );
  }

  return result.body.categoriesAnalysis ?? [];
}

export async function moderateTextByAzure(
  text: string
): Promise<TextCategoriesAnalysisOutput[]> {
  try {
    const analysisResults = await analyzeText(text);
    return analysisResults;
  } catch (error) {
    console.error("Error analyzing text with Azure Content Safety:", error);
    throw error;
  }
}

async function analysisTextWithBlocklistByAzure(
  text: string,
  blocklistName: string
): Promise<TextCategoriesAnalysisOutput[]> {
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

  console.log("Blocklist match results: ");
  if (result.body.blocklistsMatch) {
    for (const blocklistMatchResult of result.body.blocklistsMatch) {
      console.log(
        "BlocklistName: ",
        blocklistMatchResult.blocklistName,
        ", BlockItemId: ",
        blocklistMatchResult.blocklistItemId,
        ", BlockItemText: ",
        blocklistMatchResult.blocklistItemText
      );
    }
  }
}

export async function moderateImageByAzure(
  imageUrl: string
): Promise<TextCategoriesAnalysisOutput[]> {
  // Placeholder for image moderation logic
  // Azure Content Safety currently does not support image moderation directly
  throw new Error("Image moderation is not implemented yet.");
}
