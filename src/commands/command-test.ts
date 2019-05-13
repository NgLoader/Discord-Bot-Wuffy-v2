import { Command, CommandExecution } from './command';
import { Permissions, Message, RichEmbed } from 'discord.js';
import { UserPermissions, PermissionCategory, PermissionType } from '../util/permission-enum';
import { WuffyRoleEnum } from '../util/role-enum';

export const command: Command = {
    name: 'Test',
    aliases: [ 'test' ],
    onlyGuild: true,
    requiredRole: [ WuffyRoleEnum.Moderator ],
    guildPermission: [ Permissions.FLAGS.SEND_MESSAGES ],
    userPermission: [ ],

    async execute({ message, meta, args }: CommandExecution) {
        message.channel.sendMessage('Executing...');
    }
};