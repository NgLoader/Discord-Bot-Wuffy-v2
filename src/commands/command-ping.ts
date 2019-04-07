import { Command, CommandExecution } from './command';
import { Permissions, Message } from 'discord.js';
import { UserPermissions } from '../permission/user-permissions';

export const command: Command = {
    name: 'Ping',
    aliases: [ 'ping' ],
    admin: false,
    beta: false,
    onlyGuild: false,
    guildPermission: [ Permissions.FLAGS.SEND_MESSAGES ],
    userPermission: [ UserPermissions.COMMAND_PING ],

    async execute({ message }: CommandExecution) {
        const channel = message.channel;

        const startTime = Date.now();
        const pingMessage = await channel.send('Pong!') as Message;
        const timeBetween = Date.now() - startTime;

        await pingMessage.edit(`Pong! ${timeBetween}ms.`);
    }
};