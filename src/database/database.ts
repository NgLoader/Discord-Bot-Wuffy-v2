import { ConfigDatabase } from '../../config';
import { GuildSettings } from './database-guild';
import { DbLanguage } from './database-language';
import { DbUser } from './database-user';
import { LanguageEnum, TranslationKeys } from '../util/language-enum';
import { timingSafeEqual } from 'crypto';
import { User, Guild, Message } from 'discord.js';
import { Wuffy } from '../wuffy';

export interface Database {
    connect(config: ConfigDatabase): void;
    disconnect(): void;

    isConnected(): boolean;

    getUser(id: string): Promise<DbUser>;
    getGuild(id: string): Promise<GuildSettings>;
    getLanguage(id: LanguageEnum): Promise<DbLanguage>;
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

export class DbMeta {

    constructor(public client: Wuffy, public db: Database, public user: User, public dbUser: DbUser, public guild?: Guild, public dbGuild?: GuildSettings, public language?: DbLanguage) {
        (this.user as any).meta = this;
        (this.dbUser as any).meta = this;

        if (this.language) (this.language as any).meta = this;

        if (this.guild) (this.guild as any).meta = this;
        if (this.dbUser) (this.dbUser as any).meta = this;

        return this;
    }

    async loadLanguage() {
        if (this.dbUser.getLocale()) return this.setLanguage(await this.db.getLanguage(this.dbUser.getLocale()));
        if (this.dbGuild.getLocale()) return this.setLanguage(await this.db.getLanguage(this.dbGuild.getLocale()));
        return this.setLanguage(await this.db.getLanguage(LanguageEnum.ENGLISH));
    }

    setGuild(guild: Guild) {
        if (this.guild) (this.guild as any).meta = undefined;
        this.guild = guild;
        (this.guild as any).meta = this;
        return this;
    }

    setUser(user: User) {
        if (this.user) (this.user as any).meta = undefined;
        this.user = user;
        (this.user as any).meta = this;
        return this;
    }

    setDbUser(dbUser: DbUser) {
        if (this.dbUser) (this.dbUser as any).meta = undefined;
        this.dbUser = dbUser;
        (this.dbUser as any).meta = this;
        return this;
    }

    setDbGuild(dbGuild: GuildSettings) {
        if (this.dbGuild) (this.dbGuild as any).meta = undefined;
        this.dbGuild = dbGuild;
        (this.dbGuild as any).meta = this;
        return this;
    }

    setLanguage(language: DbLanguage) {
        if (this.language) (this.language as any).meta = undefined;
        this.language = language;
        (this.language as any).meta = this;
        return this;
    }

    translate(key: TranslationKeys, ...replace: string[]) {
        return this.language ? this.language.getTranslation(key, ...replace) : key;
    }

    finish() {
        if (this.dbUser) this.dbUser.saveData();
        if (this.dbGuild) this.dbGuild.saveData();
        this.destroy();
    }

    destroy() {
        this.db, this.user, this.dbUser, this.language, this.guild, this.dbGuild = undefined;
    }
}