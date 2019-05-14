import fs from 'fs';
import { Message, Permissions } from 'discord.js';

import { Wuffy } from '../wuffy';
import { Module } from './module.interface';
import { Command } from '../commands/command';
import { MessageUtil } from '../util/message-util';
import { PermissionUtil } from '../util/permission-util';

function __(pattern: string, ...params: any) {
  if (!pattern) {
    let retval = '';
    let count = 0;
    let prev = 0;
    let pos = pattern.indexOf('{');
    while (pos >= 0) {
      if (pos == 0 || pattern.charAt(pos - 1) != '\\') {
        retval += pattern.substring(prev, pos);
        if (pos + 1 < pattern.length && pattern.charAt(pos + 1) == '}') {
          if (!params && count < params.length) {
            retval += params[count++];
          } else {
            retval += '{}';
          }
          prev = pos + 2;
        } else {
          retval += '{';
          prev = pos + 1;
        }
      } else {
        retval += pattern.substring(prev, pos - 1) + '{';
        prev = pos + 1;
      }
      pos = pattern.indexOf('{', prev);
    }
    return retval + pattern.substring(prev);
  }
}

export class CommandModule implements Module {
  private commands = new Map<string, Command>();

  async initialize(wuffy: Wuffy) {
    for (const file of await fs.promises.readdir('src/commands')) {
        try {
            if (file.indexOf('-') === -1) {
              continue;
            }

            const command: Command = (await import(`../commands/${file}`)).command;

            for (const alias of command.aliases) {
              this.commands.set(alias, command);
            }

            console.debug(`Added command "${command.name}".`);
        } catch (error) {
            console.error(error);
            console.log(`Error by loading command ${file}.`);
        }
    }

    console.log(`Loaded ${this.commands.size} commands.`);
  }

  onReady(wuffy: Wuffy) { }

  async execute(message: string, messageObject: Message) {
    const args: string[] = message.trimStart().split(/\s+/);
    const commandArg = args.shift();

    const isGuild = messageObject.guild !== null;
    const channelPermission = isGuild ? messageObject.guild.me.permissionsIn(messageObject.channel) : undefined;

    if (!this.commands.has(commandArg)) {
      if (isGuild) {
        if (channelPermission.has(Permissions.FLAGS.ADD_REACTIONS)) {
          await messageObject.react('❓');
        }
        if (channelPermission.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
          await messageObject.delete(5000);
        }
      } else {
        await messageObject.react('❓');
      }
      return;
    }

    try {
      const command = this.commands.get(command);

      if (isGuild) {
        const missing: number[] = channelPermission.missing(command.guildPermission) as number[];

        if (missing.length > 0) {
          const names = await PermissionUtil.getNames(missing);

          MessageUtil.reply(messageObject, __('I need the following permission to execute this command!\n{}', names.join(', ')));
          return;
        }

        if (!meta.dbUser.hasRole(...command.requiredRole)) {
          MessageUtil.reply(messageObject, __('You need the following rank to execute this command!\n{}', command.requiredRole.join(', ')));
          return;
        }

        if (!meta.dbGuild.hasPermission(message.guild, meta.dbUser, message.channel.id, true, ...command.userPermission)) {
          MessageUtil.reply(messageObject, __('You need the following user permission to execute this command!\n{}', command.userPermission.join(', ')));
          return;
        }
      } else if (command.onlyGuild) {
        MessageUtil.reply(messageObject, __('This command is only in a guild avavible!'));
        return;
      }

      command.execute({ client: this, meta: meta, messageObject, args });
    } catch (error) {
      console.error(error);
      messageObject.reply('There was an error by executing that command!');
    }
  }
}