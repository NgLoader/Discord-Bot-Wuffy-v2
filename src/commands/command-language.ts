import { Command, CommandExecution } from './command';
import { Permissions } from 'discord.js';
import { UserPermissions } from '../util/permission-enum';
import { WuffyRoleEnum } from '../util/role-enum';
import { MessageUtil } from '../util/message-util';
import { TranslationKeys, LanguageEnum } from '../util/language-enum';

export const command: Command = {
    name: 'Language',
    aliases: [ 'language', 'lang' ],
    onlyGuild: false,
    requiredRole: [ WuffyRoleEnum.Moderator ],
    guildPermission: [ Permissions.FLAGS.SEND_MESSAGES ],
    userPermission: [ UserPermissions.COMMAND_LANGUAGE ],

    async execute({ message, meta, args }: CommandExecution) {
        MessageUtil.replyTrans(message, TranslationKeys.COMMAND_LANGUAGE_SYNTAX, {
            description: 'Hier sollte nix stehen <@98065835859382272>',
            fields: [ { name: 'Werbung', value: '404 Pascal ist %status' } ]
        }, '%status', 'dumm');

        const translation = (await meta.db.getLanguage(LanguageEnum.ENGLISH));
        translation.setTranslation(TranslationKeys.COMMAND_LANGUAGE_SYNTAX, 'Hey\nDas ist ein\ntest xD.\n%status xD');
        translation.setTranslation(TranslationKeys.COMMAND_PING, 'Ping! calculating...');
        translation.setTranslation(TranslationKeys.COMMAND_PING_RESPONSE, 'Pong! %pingms.');
        translation.saveData();
    }
};