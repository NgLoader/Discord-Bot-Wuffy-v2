import { Command, CommandExecution } from './command';
import { Permissions, Message } from 'discord.js';
import { UserPermissions } from '../util/permission-enum';

export const command: Command = {
    name: 'Play',
    aliases: [ 'play' ],
    onlyGuild: true,
    requiredRole: [ ],
    guildPermission: [ Permissions.FLAGS.SEND_MESSAGES ],
    userPermission: [ UserPermissions.UNKNOWN ],

    async execute({ message, meta, args }: CommandExecution) {
    }
};