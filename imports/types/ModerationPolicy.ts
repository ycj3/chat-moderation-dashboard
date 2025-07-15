export type ModerationPolicy = {
    createdAt: Date;
    type: string; // e.g., 'txt', 'image', etc.
    action: string;
    fields: string; // e.g., ['msg', 'caption']
}