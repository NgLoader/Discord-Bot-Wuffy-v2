import { Message, Permissions, PermissionResolvable } from 'discord.js';
import { Wuffy } from '../wuffy';
import { MessageUtil } from '../util/message-util';
import { PermissionUtil } from '../util/permission-util';

interface MessageListener {
    (this: Wuffy, message: Message): void;
}

export const message: MessageListener = async function(this: Wuffy, message: Message) {
    try {
        if (message.author.bot) return;

        const args: string[] = message.content.split(/\s+/);

        if (args.length < 0) return;

        let alias: string = args.shift();

        if (!alias.startsWith(this.config.prefix)) return;

        // TODO check mention
        alias = alias.substring(this.config.prefix.length, alias.length);

        if (alias.length == 0) {
            if (args.length == 0) return;

            alias = args.shift();
        }

        const isGuild = message.guild !== null;
        const channelPermission = isGuild ? message.guild.me.permissionsIn(message.channel) : undefined;

        if (!this.commands.has(alias)) {
            if (isGuild) {
                if (channelPermission.has(Permissions.FLAGS.ADD_REACTIONS))
                    await message.react('❓');

                if (channelPermission.has(Permissions.FLAGS.MANAGE_MESSAGES))
                    await message.delete(5000);
            } else message.react('❓');
            return;
        }

        try {
            const command = this.commands.get(alias);

            if (isGuild) {
                const missing: number[] = channelPermission.missing(command.guildPermission) as number[];

                if (missing.length > 0) {
                    const names = await PermissionUtil.getNames(missing);

                    MessageUtil.reply(message, `I need the following permission to execute this command!\n${names.join(', ')}`);
                    return;
                }

                // TODO check user permission (own permission system)
            }

            command.execute({ client: this, database: this.database, message, args });
        } catch (error) {
            console.error(error);
            message.reply('There was an error by executing that command!');
        }
    } catch (error) {
        console.error(error);
    }
};