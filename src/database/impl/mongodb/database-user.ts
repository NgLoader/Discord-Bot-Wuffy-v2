import mongoose from 'mongoose';
import { WuffyRoleEnum, WuffyRoles } from '../../../util/role-enum';
import { DbUser } from '../../database-user';
import { IMongoDBUser } from './database-mongodb';

const mongodbChema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    locale: {
        type: Number,
        default: 0
    },
    role: {
        type: [Number],
        default: [ WuffyRoleEnum.User ]
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
        return this._id.toString();
    },

    /* Locale */
    getLocale() {
        return this.locale;
    },
    setLocale(locale: number) {
        this.locale = locale;
    },

    /* Role */
    getRoles() {
        return this.role.map((id: number) => WuffyRoles.find(role => role.id == id));
    },

    hasRole(...roles: WuffyRoleEnum[]) {
        return roles.length == 0 ? true :
            this.role.length == 0 ? false :
            (roles as any).sort((a: number, b: number) => a < b)[0] >= this.role.sort((a: number, b: number) => a < b)[0];
    },

    addRole(...roles: WuffyRoleEnum[]) {
        roles.forEach(role => this.role.indexOf(role) == -1 ? this.role.push(role) : undefined);
    },

    removeRole(...roles: WuffyRoleEnum[]) {
        roles.forEach(role => this.role.pop(role));
    },

    setRole(...roles: WuffyRoleEnum[]) {
        this.role = roles.map(role => role);
    }
};
mongodbChema.methods = methods;

export const MongoDBUser = mongoose.model('user', mongodbChema, 'user');