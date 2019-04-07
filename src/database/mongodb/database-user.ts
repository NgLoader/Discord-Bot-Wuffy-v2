import mongoose from 'mongoose';
import { DbUser } from '../database';

const mongodbUserChema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
});

export const MongoDBUser = mongoose.model('user', mongodbUserChema, 'user');

export class MongodbUser implements DbUser {

    private userId: string;

    constructor(userId: string, document: MongodbUser) {
        this.userId = userId;
    }

    getLocale(userId: number): string {
        return '';
    }

    setLocale(userId: number, locale: string): void {
    }
}