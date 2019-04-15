import { Collection } from 'mongodb';
import mongoose, { Connection, Mongoose, mongo } from 'mongoose';
import { ConfigDatabase, ConfigDatabaseMongoDB } from '../../../config';
import { PercentEncodingUtil } from '../../util/percent-encoding-util';
import { Database, DbGuild, DbUser } from '../database';
import { MongoDBGuild } from './database-guild';
import { MongoDBUser } from './database-user';

export interface IMongoDBGuild extends DbGuild, mongoose.Document { }
export interface IMongoDBUser extends DbUser, mongoose.Document { }

export class DbMongoDB implements Database {
    protected settings: ConfigDatabaseMongoDB;

    protected mongoose: Mongoose = mongoose;

    protected userCache = new Map<string, IMongoDBUser>();
    protected guildCache = new Map<string, IMongoDBGuild>();

    async connect(config: ConfigDatabase) {
        this.settings = config.settings as ConfigDatabaseMongoDB;

        console.info('Database: Connecting to database...');
        await this.mongoose.connect(this.settings.usingURL ?
            this.settings.url : `mongodb://${PercentEncodingUtil.encode(this.settings.username)}:${PercentEncodingUtil.encode(this.settings.password)}@${this.settings.address}:${this.settings.port}/${PercentEncodingUtil.encode(this.settings.database)}`,
            {
                useNewUrlParser: true,
                autoReconnect: true,
                mongos: true,
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

        if (!guild) {
            guild = new MongoDBGuild({ _id: parseInt(id) }) as IMongoDBGuild;
        }

        this.guildCache.set(id, guild);
        return guild;
    }

    async getUser(id: string) {
        if (this.userCache.has(id)) {
            return this.userCache.get(id);
        }

        let user = await MongoDBUser.findById(parseInt(id)) as IMongoDBUser;

        if (!user) {
            user = new MongoDBUser({ _id: parseInt(id) }) as IMongoDBUser;
        }

        this.userCache.set(id, user);
        return user;
    }
}