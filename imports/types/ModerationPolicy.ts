export enum ModerationAction {
  NoAction = 'No Action',
  Replace = 'Replace With Asterisks (*)',
  Block = 'Block From Sending'
}

export type ModerationPolicy = {
  createdAt: Date;
  type: string; // e.g., 'txt', 'image', etc.
  action: ModerationAction;
  customField: string;
  updatedAt: Date;
}