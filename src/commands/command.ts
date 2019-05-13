import { Message } from 'discord.js';
import { UserPermissions } from '../util/permission-enum';
import { DbMeta } from '../database/database';
import { Wuffy } from '../wuffy';
import { WuffyRoleEnum } from '../util/role-enum';

export interface CommandExecutor {
    (execution: CommandExecution): void;
}

export interface CommandExecution {
    client: Wuffy;
    meta: DbMeta;
    message: Message;
    args: string[];
}

export interface Command {
    name: string;
    aliases: string[];

    onlyGuild: boolean;

    requiredRole: WuffyRoleEnum[];
    guildPermission: number[];
    userPermission: UserPermissions[];

    execute: CommandExecutor;
}