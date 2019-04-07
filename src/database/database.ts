import { ConfigDatabase } from '../../config';

export interface DatabaseConnect { }
export interface DatabaseDisconnect { }

export interface Database {
    connect(config: ConfigDatabase): void;
    disconnect(): void;

    // getUser(id: string): DbUser;
    // getGuild(): DbGuild;
}

export interface DbBase { }

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
    getLocale(guildId: string): string;

    /**
     * Set the guild locale
     * @param guildId GuildId
     * @param locale Locale as string
     */
    setLocale(guildId: string, locale: string): void;

    /**
     * Return user coins
     * @param guildId GuildId
     * @param userId  UserId
     * @returns user coins
     */
    getCoins(guildId: string, userId: number): number;

    /**
     * Set user coins
     * @param guildId GuildId
     * @param userId  UserId
     * @param coins Coins
     */
    setCoins(guildId: string, userId: number, coins: number): void;

    /**
     * Add user coins
     * @param guildId GuildId
     * @param userId  UserId
     * @param coins Coins
     */
    addCoins(guildId: string, userId: number, coins: number): void;

    /**
     * Remove user coins
     * @param guildId GuildId
     * @param userId  UserId
     * @param coins Coins
     */
    removeCoins(guildId: string, userId: number, coins: number): void;

    /**
     * Return 0 when has enough coins or returning a higher number with the ammount what needed
     * @param guildId GuildId
     * @param userId  UserId
     * @param coins Coins
     * @returns 0 when has enough coins or returning a higher number with the ammount what needed
     */
    canRemoveCoins(guildId: string, userId: number, coins: number): number;
}