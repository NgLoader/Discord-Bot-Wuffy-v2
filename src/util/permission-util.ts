import { Permissions } from 'discord.js';

export class PermissionUtil {

    private static permissionByName = new Map<string, number>();
    private static permissionByBitmask = new Map<number, string>();

    static initialize() {
        const entryMap: { [key: string]: number; } = Permissions.FLAGS;

        for (const permission in Permissions.FLAGS) {
            const bitmask = entryMap[permission];

            this.permissionByName.set(permission, bitmask);
            this.permissionByBitmask.set(bitmask, permission);
        }
    }

    static async getName(bitmask: number): Promise<string> {
        return this.permissionByBitmask.get(bitmask);
    }

    static async getNames(bitmasks: number[]): Promise<Array<string>> {
        const names = new Array<string>();

        for (const bitmask of bitmasks) names.push(this.permissionByBitmask.get(bitmask));

        return names;
    }

    static async getBitmask(name: string): Promise<number> {
        return this.permissionByName.get(name);
    }

    static async getBitmasks(names: string[]): Promise<Array<number>> {
        const bitmasks = new Array<number>();

        for (const name of names) bitmasks.push(this.permissionByName.get(name));

        return bitmasks;
    }
}

PermissionUtil.initialize();