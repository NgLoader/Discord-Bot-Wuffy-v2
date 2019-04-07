import { Collection } from 'mongodb';
import mongoose, { Connection, Mongoose } from 'mongoose';
import { ConfigDatabase, ConfigDatabaseMongoDB } from '../../../config';
import { PercentEncodingUtil } from '../../util/percent-encoding-util';
import { Database } from '../database';
import { mongodbGuildChema } from './database-guild';
import { mongodbUserChema } from './database-user';
import cron = require('node-cron');

export enum DatabaseMongoDBTypes {
    USER = 'user',
    GUILD = 'guild'
}

export class DbMongoDB implements Database {
    protected settings: ConfigDatabaseMongoDB;

    protected mongoose: Mongoose = mongoose;
    protected connection: mongoose.Connection;

    async connect(config: ConfigDatabase) {
        this.settings = config.settings as ConfigDatabaseMongoDB;

        console.info('Database: Connecting to database...');
        this.connection = (await this.mongoose.connect(this.settings.usingURL ?
            this.settings.url : `mongodb://${PercentEncodingUtil.encode(this.settings.username)}:${PercentEncodingUtil.encode(this.settings.password)}@${this.settings.address}:${this.settings.port}/${PercentEncodingUtil.encode(this.settings.database)}`,
            {
                useNewUrlParser: true,
                autoReconnect: true,
                mongos: true,
            })).connection;

        if (this.connection.readyState != 1) {
            throw '!!! Database is not connected !!!';
        }

        const Guild = this.connection.model('guild', mongodbGuildChema, DatabaseMongoDBTypes.GUILD);
        const User = mongoose.model('user', mongodbUserChema, DatabaseMongoDBTypes.USER);

        const user = new User({ name: 'fluffy' });
        console.info(user.collection.collectionName);
        console.info(user);
        user.save((err: any, product: mongoose.Document) => {
            console.log('TEST ' + err + ' - ' + product);
        });
    }

    async disconnect() {
        await this.mongoose.connection.close();
        console.log('Database: Disconnected');
    }

    getMongoose(): Mongoose {
        return this.mongoose;
    }

    getConnection(): Connection {
        return this.connection;
    }

    getCollection(type: DatabaseMongoDBTypes): Collection {
        return this.connection.collection(type);
    }
}