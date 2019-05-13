import { Command, CommandExecution } from './command';
import { Permissions, Message } from 'discord.js';
import { UserPermissions } from '../util/permission-enum';
import { MessageUtil } from '../util/message-util';
import { TranslationKeys } from '../util/language-enum';

export const command: Command = {
    name: 'Ping',
    aliases: [ 'ping' ],
    onlyGuild: false,
    requiredRole: [ ],
    guildPermission: [ Permissions.FLAGS.SEND_MESSAGES ],
    userPermission: [ UserPermissions.COMMAND_PING ],

    async execute({ message, meta, args }: CommandExecution) {
        const channel = message.channel;

        const startTime = Date.now();
        const pingMessage = await MessageUtil.replyTrans(message, TranslationKeys.COMMAND_PING) as Message;
        const timeBetween = Date.now() - startTime;

        // await pingMessage.embeds.length != 0 ? pingMessage.edit();
    }
};