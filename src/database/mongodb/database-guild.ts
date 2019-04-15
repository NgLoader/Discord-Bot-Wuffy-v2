import mongoose from 'mongoose';
import { DbGuild } from '../database';
import { IMongoDBGuild } from './database-mongodb';

const mongodbGuildChema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    locale: {
        type: Number,
        default: 0
    },
    coins: {
        type: Number,
        default: 0
    }
});

const methods: DbGuild = {
    /* Basic */
    loadData() { },
    saveData() {
        this.save({
            validateBeforeSave: true
        }, (err: any, product: IMongoDBGuild) => {
            if (err) {
                console.error(err);
            } else {
                console.debug('Database saved guild: ' + product.getId());
            }
        });
    },
    getId() {
        return this._id;
    },

    /* Locale */
    getLocale() {
        return this.locale;
    },
    setLocale(locale: number) {
        this.locale = locale;
    },

    /* Coins */
    getCoins() {
        return this.coins;
    },
    setCoins(coins: number) {
        this.coins = coins;
    },
    addCoins(coins: number) {
        this.coins += coins;
    },
    removeCoins(coins: number) {
        this.coins -= coins;

        if (this.coins < 0) {
            this.coins = 0;
        }
    },
    canRemoveCoins(coins: number) {
        const diff = this.coins - coins;

        return diff < 0 ? diff : 0;
    }
};
mongodbGuildChema.methods = methods;

export const MongoDBGuild = mongoose.model('guild', mongodbGuildChema, 'guild');