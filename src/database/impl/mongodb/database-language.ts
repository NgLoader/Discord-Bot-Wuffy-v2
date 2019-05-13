import mongoose from 'mongoose';
import { DbLanguage } from '../../database-language';
import { IMongoDBUser } from './database-mongodb';
import { TranslationKeys, TranslationKeysArray } from '../../../util/language-enum';

const mongodbChema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    translation: {
        type: Map,
        default: { }
    }
});

const methods: DbLanguage = {
    /* Basic */
    loadData() { },
    saveData() {
        this.save({
            validateBeforeSave: true
        }, (err: any, product: IMongoDBUser) => {
            if (err) {
                console.error(err);
            } else {
                console.debug('Database saved language: ' + product.getId());
            }
        });
    },
    getId() {
        return this._id.toString();
    },

    /* Translation */
    getTranslation(key: TranslationKeys, ...replace: string[]) {
        let translation = this.translation.has(key) ? this.translation.get(key) : key;

        for (let i = 0; i < replace.length; i++) translation = translation.replace(replace[i++], replace[i]);

        return translation;
    },
    setTranslation(key: TranslationKeys, value: string) {
        return this.translation.set(key, value);
    },
    deleteTranslation(key: TranslationKeys) {
        return this.translation.delete(key);
    },
    refreshAllTranslations() {
        const deletedTranslations: string[] = [];

        this.translation.forEach((value: string, key: string) => {
            // Currently not needed
            // if (key.indexOf('__')) key = key.substring(0, key.indexOf('__') + 2);

            if (TranslationKeysArray.indexOf(key) == -1 && this.deleteTranslation(key)) deletedTranslations.push(key);
        });

        return deletedTranslations;
    },
    getUnsetTranslations() {
        const unset: TranslationKeys[] = [];

        TranslationKeysArray.forEach((key: TranslationKeys) => {
            if (!this.translation.has(key)) unset.push(key);
        });

        return unset;
    }
};
mongodbChema.methods = methods;

export const MongoDBLanguage = mongoose.model('language', mongodbChema, 'language');