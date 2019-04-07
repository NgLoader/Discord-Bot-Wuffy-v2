import { Command, CommandExecution } from './command';
import { Permissions, Message } from 'discord.js';
import { UserPermissions } from '../permission/user-permissions';

export const command: Command = {
    name: 'Play',
    aliases: [ 'play' ],
    admin: false,
    beta: false,
    onlyGuild: true,
    guildPermission: [ Permissions.FLAGS.SEND_MESSAGES ],
    userPermission: [ UserPermissions.UNKNOWN ],

    async execute({ client, message }: CommandExecution) {
    }
};