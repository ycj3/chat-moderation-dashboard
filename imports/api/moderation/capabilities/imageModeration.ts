import { ModerationResult } from "/imports/types/ModerationResult";

export interface ImageModerationProvider {
  name: string;
  moderateImage(imageUrl: string): Promise<ModerationResult>;
}
