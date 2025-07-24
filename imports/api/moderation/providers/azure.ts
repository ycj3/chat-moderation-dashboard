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
export async function analyzeText(
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
