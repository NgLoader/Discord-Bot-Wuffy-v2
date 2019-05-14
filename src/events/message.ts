import { Message, Permissions, PermissionResolvable, Guild } from 'discord.js';
import { Wuffy } from '../wuffy';
import { MessageUtil } from '../util/message-util';
import { PermissionUtil } from '../util/permission-util';
import { DbMeta } from '../database/database';

interface MessageListener {
    (this: Wuffy, message: Message): void;
}

export const message: MessageListener = async function(message: Message) {
    try {
        if (message.author.bot)
            return;

        const args: string[] = message.content.split(/\s+/);

        if (args.length < 0)
            return;

        if (!this.database.isConnected())
            return;

        let alias: string = args.shift();

        if (!alias.startsWith(this.config.prefix))
            return;

        // TODO check mention
        alias = alias.substring(this.config.prefix.length, alias.length);

        if (alias.length == 0) {
            if (args.length == 0)
                return;

            alias = args.shift();
        }

        const isGuild = message.guild !== null;
        const channelPermission = isGuild ? message.guild.me.permissionsIn(message.channel) : undefined;
        const meta = new DbMeta(this, this.database, message.author, await this.database.getUser(message.author.id));

        if (isGuild)
            meta.setGuild(message.guild).setDbGuild(await this.database.getGuild(message.guild.id));
        meta.loadLanguage();

        (message as any).meta = meta;

        if (!this.commands.has(alias)) {
            if (isGuild) {
                if (channelPermission.has(Permissions.FLAGS.ADD_REACTIONS))
                    await message.react('❓');

                if (channelPermission.has(Permissions.FLAGS.MANAGE_MESSAGES))
                    await message.delete(5000);
            } else
                message.react('❓');
            return;
        }

        try {
            const command = this.commands.get(alias);

            if (isGuild) {
                const missing: number[] = channelPermission.missing(command.guildPermission) as number[];

                if (missing.length > 0) {
                    const names = await PermissionUtil.getNames(missing);

                    MessageUtil.reply(message, `I need the following permission to execute this command!\n${names.join(', ')}`);
                    return meta.destroy();
                }

                if (!meta.dbUser.hasRole(...command.requiredRole)) {
                    MessageUtil.reply(message, `You need the following rank to execute this command!\n${command.requiredRole.join(', ')}`);
                    return meta.destroy();
                }

                if (!meta.dbGuild.hasPermission(message.guild, meta.dbUser, message.channel.id, true, ...command.userPermission)) {
                    MessageUtil.reply(message, `You need the following user permission to execute this command!\n${command.userPermission.join(', ')}`);
                    return meta.destroy();
                }
            } else if (command.onlyGuild) {
                MessageUtil.reply(message, `This command is only in a guild avavible!`);
                return meta.destroy();
            }

            command.execute({ client: this, meta: meta, message, args });
            meta.finish();
        } catch (error) {
            console.error(error);
            message.reply('There was an error by executing that command!');

            if (meta) meta.destroy();
        }
    } catch (error) {
        console.error(error);
    }
};