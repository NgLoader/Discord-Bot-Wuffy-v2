import { Command, CommandExecution } from './command';
import { Permissions, Message } from 'discord.js';
import { UserPermissions } from '../permission/user-permissions';

export const command: Command = {
    name: 'Test',
    aliases: [ 'test' ],
    admin: false,
    beta: false,
    onlyGuild: true,
    guildPermission: [ Permissions.FLAGS.SEND_MESSAGES ],
    userPermission: [ UserPermissions.UNKNOWN ],

    async execute({ client, user, guild, message, database }: CommandExecution) {
        message.channel.sendMessage('Executing...');
        message.channel.sendMessage(`Currently coins: ${guild.getCoins(100)}`);
        guild.addCoins(100, 100);
        message.channel.sendMessage(`Added 100 coins. Balance: ${guild.getCoins(100)}`);
    }
};