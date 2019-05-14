import { Guild } from 'discord.js';
import { PermissionCategory, PermissionType, UserPermissions } from '../util/permission-enum';
import { DbBase } from './database';
import { DbUser } from './database-user';
import { LanguageEnum } from '../util/language-enum';

export interface GuildSettings extends DbBase {
    /**
     * Return guild locale as string
     * @param guildId GuildId
     * @returns Guild locale as string
     */
    getLocale(): LanguageEnum;
    /**
     * Set the guild locale
     * @param guildId GuildId
     * @param locale Locale as string
     */
    setLocale(locale: LanguageEnum): void;

    /**
     * Returns all prefixes
     * @returns prefixes as string array
     */
    getPrefixes(): string[];

    /**
     * Set all prefixes
     * @param prefixes string[]
     */
    setPrefixes(prefixes: string[]): void;

    /**
     * Add a prefix
     * @param prefix string
     */
    addPrefix(prefix: string): void;

    /**
     * Remove a prefix
     * @param prefix string
     */
    removePrefix(prefix: string): void;

    /**
     * Check is prefix in list
     * @param prefix string
     */
    isPrefix(prefix: string): boolean;

    getMentionCommandExecution(): boolean;

    setMentionCommandExecution(value: boolean): void;

    /**
     * Return user coins
     * @param guildId GuildId
     * @param userId  UserId
     * @returns user coins
     */
    getCoins(userId: string): number;

    /**
     * Set user coins
     * @param guildId GuildId
     * @param userId  UserId
     * @param coins Coins
     */
    setCoins(userId: string, coins: number): void;

    /**
     * Add user coins
     * @param guildId GuildId
     * @param userId  UserId
     * @param coins Coins
     */
    addCoins(userId: string, coins: number): void;

    /**
     * Remove user coins
     * @param guildId GuildId
     * @param userId  UserId
     * @param coins Coins
     */
    removeCoins(userId: string, coins: number): void;

    /**
     * Return 0 when has enough coins or returning a higher number with the ammount what needed
     * @param guildId GuildId
     * @param userId  UserId
     * @param coins Coins
     * @returns 0 when has enough coins or returning a higher number with the ammount what needed
     */
    canRemoveCoins(userId: string, coins: number): number;

    hasPermission(guild: Guild, dbUser: DbUser, channel: string, hasAll: boolean, ...permission: UserPermissions[]): boolean;

    getPermission(category: PermissionCategory, type: PermissionType, id: string, channel: string): UserPermissions[];
    addPermission(category: PermissionCategory, type: PermissionType, id: string, channel: string, ...permission: UserPermissions[]): boolean;
    removePermission(category: PermissionCategory, type: PermissionType, id: string, channel: string, ...permission: UserPermissions[]): boolean;
}