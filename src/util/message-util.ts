import { Message, Permissions, RichEmbed, Channel, RichEmbedOptions, User, Guild } from 'discord.js';
import { TranslationKeys, LanguageEnum } from './language-enum';
import { Wuffy } from '../wuffy';
import { DbUser } from '../database/database-user';
import { DbGuild } from '../database/database-guild';
import { DbMeta } from '../database/database';

export class MessageUtil {

    static async replyTrans(message: Message, key: TranslationKeys, embedOptions?: RichEmbedOptions, ...replace: string[]): Promise<Message | Message[]> {
        let locale = (message as any).dbUser != undefined ? (((message as any).dbUser) as DbUser).getLocale() : undefined;

        if (!locale) {
            if (message.guild != undefined && message.channel.type != 'dm' && (message as any).dbGuild != undefined) {
                locale = (((message as any).dbGuild) as DbGuild).getLocale();
            } else locale = LanguageEnum.ENGLISH;
        }

        return this.reply(message, await this.translate(message, key, ...replace), embedOptions, ...replace);
    }

    static async reply({ guild, channel, author }: Message, message: string, embedOptions?: RichEmbedOptions, ...replace: string[]): Promise<Message | Message[]> {
        const embed = this.generateEmbed(author, message, embedOptions, ...replace);

        if (guild != undefined && channel.type != 'dm') {
            const channelPermission = await guild.me.permissionsIn(channel);

            if (channelPermission != undefined && await channelPermission.has(Permissions.FLAGS.SEND_MESSAGES)) {
                if (await channelPermission.has(Permissions.FLAGS.EMBED_LINKS)) return channel.send(embed);

                return channel.send(embed.title ? `\`\`${embed.title}\`\`\n${embed.description}` : message);
            }
        }

        if (author.dmChannel === null) await author.createDM();
        try {
            return author.dmChannel.send(embed);
        } catch (error) {
            console.error(error);
        }
        return undefined;
    }

    static async translate(message: Message, key: TranslationKeys, ...replace: string[]): Promise<string> {
        let locale = (message as any).dbUser != undefined ? (((message as any).dbUser) as DbUser).getLocale() : undefined;

        if (!locale) {
            if (message.guild != undefined && message.channel.type != 'dm' && (message as any).dbGuild != undefined) {
                locale = (((message as any).dbGuild) as DbGuild).getLocale();
            } else locale = LanguageEnum.ENGLISH;
        }

        return (await (message.client as Wuffy).database.getLanguage(locale)).getTranslation(key, ...replace);
    }

    static generateEmbed(author: User, message: string, embedOptions?: RichEmbedOptions, ...replace: string[]) {
        const embed = new RichEmbed(embedOptions);

        if (embedOptions && embedOptions.fields) {
            embedOptions.fields.forEach(field => {
                for (let i = 0; i < replace.length; i++) {
                    const key = replace[i++];
                    const value = replace[i];

                    field.name = field.name.replace(key, value);
                    field.value = field.value.replace(key, value);
                }
            });
        }

        if (!embed.description) embed.setDescription(message);
        else if (!embed.title) embed.setTitle(message);
        if (!embed.color) embed.setColor(3135625);
        if (!embed.timestamp) embed.setTimestamp(new Date(Date.now()));
        if (!embed.footer) embed.setFooter(author.username, author.displayAvatarURL);

        return  embed;
    }
}