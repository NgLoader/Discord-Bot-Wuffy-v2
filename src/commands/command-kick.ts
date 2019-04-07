import { GuildMember, Permissions, Collection, Guild } from 'discord.js';
import { Command, CommandExecution } from './command';
import { MessageUtil } from '../util/message-util';
import { UserPermissions } from '../permission/user-permissions';

export const command: Command = {
    name: 'Kick',
    aliases: [ 'kick' ],
    admin: false,
    beta: false,
    onlyGuild: true,
    guildPermission: [ Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.KICK_MEMBERS ],
    userPermission: [ UserPermissions.COMMAND_KICK ],

    async execute({ message, args }: CommandExecution) {
        const mentions = message.mentions.members;
        const reason = args.filter(arg => !(arg.startsWith('<@') && arg.endsWith('>'))).join(' ');
        const botHighestRole = message.guild.me.highestRole.position;

        const kicked = [] as String[];
        const notKicked = [] as String[];

        for (const mention of mentions) {
            const member = mention[1];

            if (member.kickable && member.highestRole.position < botHighestRole) {
                try {
                    await member.kick(reason);
                    kicked.push(member.displayName);
                } catch (error) {
                    notKicked.push(member.displayName);
                }
            } else {
                notKicked.push(member.displayName);
            }
        }

        MessageUtil.reply(message, `Kicked: ${kicked.join(' ')}, NotKickable: ${notKicked.join(' ')}`);
    }
};