import mongoose from 'mongoose';
import { DbGuild } from '../database';

export const mongodbGuildChema = new mongoose.Schema({
    name: String
});
/*
export const DBGuildModule = mongoose.model('guild', new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        match: '[a-Z]',
        default: 'Hallo'
    }
}));
*/

export class DBMongoGuild implements DbGuild {

    constructor(mongoose: any) {
    }

    getLocale(guildId: string): string {
        return '';
    }

    setLocale(guildId: string, locale: string): void {
    }

    getCoins(guildId: string, userId: number): number {
        return 0;
    }

    setCoins(guildId: string, userId: number, coins: number): void {
    }

    addCoins(guildId: string, userId: number, coins: number): void {
    }

    removeCoins(guildId: string, userId: number, coins: number): void {
    }

    canRemoveCoins(guildId: string, userId: number, coins: number): number {
        return 0;
    }
}