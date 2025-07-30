import { ModerationResult } from "/imports/types/ModerationResult";

export interface TextModerationProvider {
  name: string;
  moderateText(text: string): Promise<ModerationResult>;
}
