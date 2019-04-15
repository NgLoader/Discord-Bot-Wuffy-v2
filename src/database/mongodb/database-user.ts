import mongoose from 'mongoose';
import { DbUser } from '../database';
import { IMongoDBUser } from './database-mongodb';

const mongodbUserChema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    locale: {
        type: Number,
        default: 0
    }
});

const methods: DbUser = {
    /* Basic */
    loadData() { },
    saveData() {
        this.save({
            validateBeforeSave: true
        }, (err: any, product: IMongoDBUser) => {
            if (err) {
                console.error(err);
            } else {
                console.debug('Database saved user: ' + product.getId());
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
    }
};
mongodbUserChema.methods = methods;

export const MongoDBUser = mongoose.model('user', mongodbUserChema, 'user');