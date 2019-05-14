import fs from 'fs';
import { Client } from 'discord.js';
import { Config } from '../config';
import { Command } from './commands/command';
import { Database } from './database/database';
import { commandHandler } from './handler/command-handler';
import { databaseHandler } from './handler/database-handler';
import { eventHandler } from './handler/event-handler';
import { ModuleConstructor, Module } from './module/module.interface';

export class Wuffy extends Client {
    private modules = new Map<ModuleConstructor<Module>, Module>();

    public commands = new Map<string, Command>();
    public database: Database;
    public config: Config;

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

    get<T extends Module>(moduleConstructor: ModuleConstructor<T>): T {
        return this.modules.get(moduleConstructor) as T;
    }
}

new Wuffy(JSON.parse(fs.readFileSync('./config.json') as any));