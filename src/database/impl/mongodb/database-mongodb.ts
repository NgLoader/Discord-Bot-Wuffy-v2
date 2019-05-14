import { Collection } from 'mongodb';
import mongoose, { Connection, Mongoose } from 'mongoose';
import { ConfigDatabase, ConfigDatabaseMongoDB } from '../../../../config';
import { PercentEncodingUtil } from '../../../util/percent-encoding-util';
import { Database } from '../../database';
import { GuildSettings } from '../../database-guild';
import { DbLanguage } from '../../database-language';
import { DbUser } from '../../database-user';
import { MongoDBGuild } from './database-guild';
import { MongoDBLanguage } from './database-language';
import { MongoDBUser } from './database-user';
import { LanguageEnum } from '../../../util/language-enum';

export interface IMongoDBGuild extends GuildSettings, mongoose.Document { }
export interface IMongoDBUser extends DbUser, mongoose.Document { }
export interface IMongoDBLanguage extends DbLanguage, mongoose.Document { }

export class DbMongoDB implements Database {
    protected settings: ConfigDatabaseMongoDB;

    protected mongoose: Mongoose = mongoose;

    protected guildCache = new Map<string, IMongoDBGuild>();

    async connect(config: ConfigDatabase) {
        this.settings = config.settings as ConfigDatabaseMongoDB;

        console.info('Database: Connecting to database...');
        await this.mongoose.connect(this.settings.usingURL ?
            this.settings.url : `mongodb://${PercentEncodingUtil.encode(this.settings.username)}:${PercentEncodingUtil.encode(this.settings.password)}@${this.settings.address}:${this.settings.port}/${PercentEncodingUtil.encode(this.settings.database)}`,
            {
                useNewUrlParser: true,
                autoReconnect: true,
                mongos: true
            });

        if (this.mongoose.connection.readyState != 1) {
            throw '!!! Database is not connected !!!';
        }
    }

    async disconnect() {
        await this.mongoose.connection.close();
        await this.mongoose.disconnect();
        console.log('Database: Disconnected');
    }

    isConnected() {
        return this.mongoose.connection.readyState == 1;
    }

    getMongoose(): Mongoose {
        return this.mongoose;
    }

    getConnection(): Connection {
        return this.mongoose.connection;
    }

    getCollection(collectionName: string): Collection {
        return this.mongoose.connection.collection(collectionName);
    }

    async getGuild(id: string) {
        if (this.guildCache.has(id)) {
            return this.guildCache.get(id);
        }

        let guild = await MongoDBGuild.findById(parseInt(id)) as IMongoDBGuild;
        if (!guild) guild = new MongoDBGuild({ _id: parseInt(id) }) as IMongoDBGuild;

        this.guildCache.set(id, guild);
        return guild;
    }

    async getUser(id: string) {
        let user = await MongoDBUser.findById(parseInt(id)) as IMongoDBUser;
        if (!user) user = new MongoDBUser({ _id: parseInt(id) }) as IMongoDBUser;

        return user;
    }

    async getLanguage(id: LanguageEnum) {
        let language = await MongoDBLanguage.findById(id) as IMongoDBLanguage;
        if (!language) language = new MongoDBLanguage({ _id: id }) as IMongoDBLanguage;

        return language;
    }
}