import {
  TextCategoriesAnalysisOutput,
  TextBlocklistMatchOutput,
  AnalyzeImageResultOutput,
} from "@azure-rest/ai-content-safety";

export interface ModerationResult<T = RawModerationResult> {
  raw: T;
  normalized: NormalizedModerationResult;
}

/** Normalized result used for unified policy decision and UI rendering */
export interface NormalizedModerationResult {
  provider: string; // e.g., "azure"
  inputType?: "text" | "image";
  timestamp: string; // ISO date string

  // Text-related
  text?: NormalizedTextModerationResult; // AI Model
  blocklist?: NormalizedBlocklistResult; // Custom terms

  // Image-related
  image?: NormalizedImageModerationResult; // AI Model
}

/** Normalized result for text moderation models */
export interface NormalizedTextModerationResult {
  categories: Array<{
    label: string; // e.g., "Violence", "Hate"
    severity: number | string; // e.g., 2 or "high"
  }>;
}

/** Normalized result for blocklist matches */
export interface NormalizedBlocklistResult {
  matches: Array<{
    blocklistName: string;
    matchedText: string;
    matchedItemId?: string;
  }>;
}

// TODO: Add NormalizedImageModerationResult implementation if needed
/** Normalized result for image moderation (optional, future use) */
export interface NormalizedImageModerationResult {}

export type AzureModerationResult =
  | TextCategoriesAnalysisOutput
  | TextBlocklistMatchOutput
  | AnalyzeImageResultOutput;

export type RawModerationResult = AzureModerationResult;
