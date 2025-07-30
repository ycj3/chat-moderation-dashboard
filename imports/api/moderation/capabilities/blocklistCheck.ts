import { ModerationResult } from "/imports/types/ModerationResult";

export interface BlocklistCheckProvider {
  name: string;
  checkBlocklist(
    text: string,
    blocklistName: string
  ): Promise<ModerationResult>;
}
