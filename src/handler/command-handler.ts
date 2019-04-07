import { readdirSync } from 'fs';
import { Command } from '../commands/command';
import { Wuffy } from '../wuffy';

interface CommandHandler {
    (this: Wuffy): void;
}

export const commandHandler: CommandHandler = async function(this: Wuffy) {
    for (const file of readdirSync('src/commands')) {
        try {
            if (file.indexOf('-') === -1) continue;

            const command: Command = (await import(`../commands/${file}`)).command;

            for (const alias of command.aliases)
                this.commands.set(alias, command);

            console.debug(`Added command "${command.name}".`);
        } catch (error) {
            console.error(error);
            console.log(`Error by loading command ${file}.`);
        }
    }

    console.log(`Loaded ${this.commands.size} commands.`);
};