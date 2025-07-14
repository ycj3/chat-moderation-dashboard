import { Mongo } from 'meteor/mongo';

type BlocklistItem = {
    _id: string;
    word: string;
    category: string;
    createdAt: Date;
}

export const Blocklist = new Mongo.Collection<BlocklistItem>('blocklist');