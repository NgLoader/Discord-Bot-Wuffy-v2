import { Message } from 'discord.js';

import { Wuffy } from '../wuffy';
import { Module } from './module.interface';
import { CommandModule } from './command.module';

export class EventModule implements Module {
  initialize(wuffy: Wuffy): void {
    wuffy.on('message', this.message.bind(wuffy));
    wuffy.on('ready', this.ready.bind(wuffy));
  }

  onReady(wuffy: Wuffy): void { }

  async message(this: Wuffy, message: Message) {
    if (message.author.bot || !this.database.isConnected()) {
      return;
    }
    const commandModule = this.get(CommandModule);

    const contentLowerCase = message.content.toLowerCase();
    const guildSettings = await this.database.getGuild(message.guild.id);
    const prefixes = guildSettings.getPrefixes();

    if (guildSettings.getMentionCommandExecution()) {
      prefixes.push(`<@${this.user.id}>`);
    }

    for (const prefix of prefixes) {
      if (contentLowerCase.startsWith(prefix)) {
        await commandModule.execute(message.content.substr(0, prefix.length), message);
        return;
      }
    }
  }

  ready(this: Wuffy) {
    if (this.shard === null) {
        console.info(`Wuffy is ready without sharding.`);
    } else {
        console.info(`Wuffy is ready on shard ${this.shard.id}/${this.shard.count}.`);
    }
  }
}