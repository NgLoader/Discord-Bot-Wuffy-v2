import { Guild } from 'discord.js';
import mongoose from 'mongoose';
import { BitBuffer } from '../../../util/bit-buffer';
import { PermissionCategory, PermissionCategoryValues, PermissionType, PermissionTypeValues, UserPermissions, UserPermissionValues } from '../../../util/permission-enum';
import { WuffyRoleEnum } from '../../../util/role-enum';
import { DbGuild } from '../../database-guild';
import { DbUser } from '../../database-user';
import { IMongoDBGuild } from './database-mongodb';

const mongodbChema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    locale: {
        type: Number,
        default: 0
    },
    prefix: {
        type: [String],
        default: ['!'],
        maxlength: 10,
        minlength: 1
    },
    coins: {
        type: Map,
        default: { }
    },
    permission: {
        type: JSON,
        default: {}
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
        return this._id.toString();
    },

    /* Locale */
    getLocale() {
        return this.locale;
    },
    setLocale(locale: number) {
        this.locale = locale;
    },

    /* Prefix */
    getPrefixes() {
        return this.prefix;
    },
    setPrefixes(prefix: string[]) {
        this.prefix = prefix;
    },
    addPrefix(prefix: string) {
        this.prefix.push(prefix);
    },
    removePrefix(prefix: string) {
        this.prefix.pull(prefix);
    },
    isPrefix(prefix: string) {
        return this.prefix.indexOf(prefix);
    },

    /* Coins */
    getCoins(id: string) {
        return this.coins.has(id) ? this.coins.get(id) : 0;
    },
    setCoins(id: string, coins: number) {
        this.coins.set(id, coins);
    },
    addCoins(id: string, coins: number) {
        this.coins.set(id, this.getCoins(id) + coins);
    },
    removeCoins(id: string, coins: number) {
        let currentlyCoins = this.getCoins(id) + coins;

        if (currentlyCoins < 0) {
            currentlyCoins = 0;
        }

        this.coins.set(id, currentlyCoins);
    },
    canRemoveCoins(id: string, coins: number) {
        const diff = this.getCoins(id) - coins;

        return diff < 0 ? diff : 0;
    },

    /* Permission */
    hasPermission(guild: Guild, dbUser: DbUser, channel: string, hasAll: boolean, ...permission: UserPermissions[]) {
        const found: number[] = hasAll ? [] : undefined;
        const id = dbUser.getId();

        console.info('XD -> ' + dbUser.hasRole(WuffyRoleEnum.Admin));
        if (permission.length == 0 || guild.ownerID == id || dbUser.hasRole(WuffyRoleEnum.Admin)) return true;
        console.info('XD2');

        for (const category of PermissionCategoryValues) {
            for (const type of PermissionTypeValues) {
                if (!this.permission[category] || !this.permission[category][type]) continue;

                const types = this.permission[category][type];

                if (!types[id]) continue;

                switch (category) {
                    case PermissionCategory.CHANNEL:
                        let buffer = new BitBuffer(types[id][channel] as Buffer);

                        for (const perm of permission) {
                            if (buffer.get(perm)) {
                                if (!hasAll) return true;

                                if (found.indexOf(perm) == -1) found.push(perm);

                                if (found.length == permission.length) return true;
                            }
                        }
                        continue;

                    case PermissionCategory.GLOBAL:
                        buffer = new BitBuffer(types[id] as Buffer);

                        for (const perm of permission) {
                            if (buffer.get(perm)) {
                                if (!hasAll) return true;

                                if (found.indexOf(perm) == -1) found.push(perm);

                                if (found.length == permission.length) return true;
                            }
                        }
                        continue;
                    default:
                        continue;
                }
            }
        }

        return false;
    },
    getPermission(category: PermissionCategory, type: PermissionType, id: string, channel: string) {
        const permission: UserPermissions[] = [];

        if (!this.permission[category] || !this.permission[category][type]) return permission;

        const types = this.permission[category][type];

        if (!types[id]) return permission;

        switch (category) {
            case PermissionCategory.CHANNEL:
                let buffer = new BitBuffer(types[id][channel] as Buffer);

                return UserPermissionValues.filter(value => buffer.get(value));

            case PermissionCategory.GLOBAL:
                buffer = new BitBuffer(types[id] as Buffer);

                return UserPermissionValues.filter(value => buffer.get(value));
            default:
            return permission;
        }
    },
    addPermission(category: PermissionCategory, type: PermissionType, id: string, channel: string, ...permission: UserPermissions[]) {
        if (!this.permission[category]) {
            const buffer = new BitBuffer(512);
            permission.forEach(perm => buffer.set(perm, true));

            this.permission[category] = { [type]: { [id]: { [channel]: buffer.buffer } } };
            return true;
        } else if (!this.permission[category][type]) {
            const buffer = new BitBuffer(512);
            permission.forEach(perm => buffer.set(perm, true));

            this.permission[category][type] = { [id]: { [channel]: buffer.buffer } };
            return true;
        }

        const types = this.permission[category][type];
        let status = false;

        switch (category) {
            case PermissionCategory.CHANNEL:
                if (!types[id]) {
                    const buffer = new BitBuffer(BitBuffer.DEFAULT_SIZE);
                    permission.forEach(perm => buffer.set(perm, true));

                    types[id] = { [channel]: buffer.buffer };
                    return true;
                }

                let buffer = new BitBuffer(types[id][channel] as Buffer);

                for (const perm of permission) {
                    if (buffer.get(perm)) continue;

                    buffer.set(perm, true);

                    if (status) continue;
                    status = true;
                }
                return status;

            case PermissionCategory.GLOBAL:
                if (!types[id]) {
                    const buffer = new BitBuffer(BitBuffer.DEFAULT_SIZE);
                    permission.forEach(perm => buffer.set(perm, true));

                    this.permission[category][type] = { [id]: buffer.buffer };
                    return true;
                }

                buffer = new BitBuffer(types[id] as Buffer);

                for (const perm of permission) {
                    if (buffer.get(perm)) continue;

                    buffer.set(perm, true);

                    if (status) continue;
                    status = true;
                }
                return status;
            default:
                return false;
        }
    },
    removePermission(category: PermissionCategory, type: PermissionType, id: string, channel: string, ...permission: UserPermissions[]) {
        if (!this.permission[category] || !this.permission[category][type]) return false;

        const types = this.permission[category][type];
        let status = false;

        switch (category) {
            case PermissionCategory.CHANNEL:
                if (!types[id]) return false;

                let buffer = new BitBuffer(types[id][channel] as Buffer);

                for (const perm of permission) {
                    if (!buffer.get(perm)) continue;

                    buffer.set(perm, false);

                    if (status) continue;
                    status = true;
                }
                return status;

            case PermissionCategory.GLOBAL:
                if (!types[id]) return false;

                buffer = new BitBuffer(types[id] as Buffer);

                for (const perm of permission) {
                    if (!buffer.get(perm)) continue;

                    buffer.set(perm, false);

                    if (status) continue;
                    status = true;
                }
                return status;
            default:
                return false;
        }
    }
};
mongodbChema.methods = methods;

export const MongoDBGuild = mongoose.model('guild', mongodbChema, 'guild');