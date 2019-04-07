import { Client } from 'discord.js';
import { config, Config } from '../config';
import { Command } from './commands/command';
import { Database } from './database/database';
import { commandHandler } from './handler/command-handler';
import { databaseHandler } from './handler/database-handler';
import { eventHandler } from './handler/event-handler';

export class Wuffy extends Client {
    protected commands = new Map<string, Command>();
    protected database: Database;
    protected config: Config;

    /**
     * create a new bot instance
     * @param token Bot token
     */
    constructor(config: Config) {
        super();
        this.config = config;

        console.info('Starting Wuffy');

        // Calling handler's
        databaseHandler.call(this);
        commandHandler.call(this);
        eventHandler.call(this);

        // Login to discord
        this.login(config.token);

        // Remove token from config
        delete config.token;

        // Debug instance
        console.debug(this);
    }
}

if (process.argv.includes('--typescript')) {
    new Wuffy(require('../config-private').config);
} else
    new Wuffy(config);