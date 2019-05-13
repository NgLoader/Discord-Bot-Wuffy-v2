import { Command, CommandExecution } from './command';
import { Permissions, Message } from 'discord.js';
import { UserPermissions, PermissionCategory } from '../util/permission-enum';
import { MessageUtil } from '../util/message-util';

export const command: Command = {
    name: 'Prefix',
    aliases: [ 'prefix' ],
    onlyGuild: true,
    requiredRole: [ ],
    guildPermission: [ Permissions.FLAGS.SEND_MESSAGES ],
    userPermission: [ UserPermissions.COMMAND_PREFIX ],

    async execute({ message, meta, args }: CommandExecution) {
    }
};