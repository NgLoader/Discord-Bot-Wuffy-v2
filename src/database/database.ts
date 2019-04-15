import { ConfigDatabase } from '../../config';
import mongoose from 'mongoose';

export interface DatabaseConnect { }
export interface DatabaseDisconnect { }

export interface Database {
    connect(config: ConfigDatabase): void;
    disconnect(): void;

    isConnected(): boolean;

    getUser(id: string): Promise<DbUser>;
    getGuild(id: string): Promise<DbGuild>;
}

export interface DbBase {
    /**
     * Load the data from database
     */
    loadData(): void;

    /**
     * Save the data into the database
     */
    saveData(): void;

    /**
     * Return the currently id
     * @returns ID
     */
    getId(): string;
}

export interface DbUser extends DbBase {
    /**
     * Return user locale as string
     * @param userId GuildId
     * @returns User locale as string
     */
    getLocale(userId: number): string;

    /**
     * Set the user locale
     * @param userId GuildId
     * @param locale User locale as string
     */
    setLocale(userId: number, locale: string): void;
}

export interface DbGuild extends DbBase {
    /**
     * Return guild locale as string
     * @param guildId GuildId
     * @returns Guild locale as string
     */
    getLocale(): number;

    /**
     * Set the guild locale
     * @param guildId GuildId
     * @param locale Locale as string
     */
    setLocale(locale: number): void;

    /**
     * Return user coins
     * @param guildId GuildId
     * @param userId  UserId
     * @returns user coins
     */
    getCoins(userId: number): number;

    /**
     * Set user coins
     * @param guildId GuildId
     * @param userId  UserId
     * @param coins Coins
     */
    setCoins(userId: number, coins: number): void;

    /**
     * Add user coins
     * @param guildId GuildId
     * @param userId  UserId
     * @param coins Coins
     */
    addCoins(userId: number, coins: number): void;

    /**
     * Remove user coins
     * @param guildId GuildId
     * @param userId  UserId
     * @param coins Coins
     */
    removeCoins(userId: number, coins: number): void;

    /**
     * Return 0 when has enough coins or returning a higher number with the ammount what needed
     * @param guildId GuildId
     * @param userId  UserId
     * @param coins Coins
     * @returns 0 when has enough coins or returning a higher number with the ammount what needed
     */
    canRemoveCoins(userId: number, coins: number): number;
}