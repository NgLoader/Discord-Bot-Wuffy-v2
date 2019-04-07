import { Message, Client, Permissions } from 'discord.js';
import { Wuffy } from '../wuffy';
import { Database } from '../database/database';

export interface CommandExecutor {
    (execution: CommandExecution): void;
}

export interface CommandExecution {
    client: Wuffy;
    database: Database;
    message: Message;
    args: string[];
}

export interface Command {
    name: string;
    aliases: string[];

    admin: boolean;
    beta: boolean;

    onlyGuild: boolean;

    guildPermission: number[];
    userPermission: number[];

    execute: CommandExecutor;
}