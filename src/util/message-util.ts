import { Message, Permissions, RichEmbed } from 'discord.js';

export class MessageUtil {

    static async reply({ guild: { me }, channel, author }: Message, answer: string) {
        const channelPermission = await me.permissionsIn(channel);

        if (channelPermission != undefined && await channelPermission.has(Permissions.FLAGS.SEND_MESSAGES)) {
            if (await channelPermission.has(Permissions.FLAGS.EMBED_LINKS)) {
                await channel.send(new RichEmbed()
                    .setDescription(answer)
                    .setColor(0xfff));
                return;
            }
            await channel.send(answer);
            return;
        }
        if (author.dmChannel === null) await author.createDM();

        try {
            await author.dmChannel.send(new RichEmbed()
            .setDescription(answer)
            .setColor(0xfff));
        } catch (error) {
            console.error(error);
        }
    }
}