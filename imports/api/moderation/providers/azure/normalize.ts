import {
  TextCategoriesAnalysisOutput,
  TextBlocklistMatchOutput,
  AnalyzeTextResultOutput,
} from "@azure-rest/ai-content-safety";

import {
  NormalizedModerationResult,
  NormalizedBlocklistResult,
  NormalizedTextModerationResult,
} from "/imports/types/ModerationResult";

/**
 * Normalize the Azure AnalyzeTextResultOutput to internal format
 */
export function normalizeAzureTextModerationResult(
  raw: AnalyzeTextResultOutput
): NormalizedModerationResult {
  const timestamp = new Date().toISOString();

  const blocklist: NormalizedBlocklistResult | undefined = raw.blocklistsMatch
    ? {
        matches: raw.blocklistsMatch.map((match: TextBlocklistMatchOutput) => ({
          blocklistName: match.blocklistName,
          matchedText: match.blocklistItemText,
          matchedItemId: match.blocklistItemId,
        })),
      }
    : undefined;

  const text: NormalizedTextModerationResult = {
    categories: raw.categoriesAnalysis.map(
      (cat: TextCategoriesAnalysisOutput) => ({
        label: cat.category,
        severity: cat.severity ?? 0,
      })
    ),
  };

  return {
    provider: "azure",
    inputType: "text",
    timestamp,
    blocklist,
    text,
  };
}
