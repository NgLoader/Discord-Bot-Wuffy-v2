import { ShardingManager } from 'discord.js';
import { Config } from '../config';

const dev = process.argv.includes('--typescript'); // TODO Find a better way...

const options: any = {
    token: (dev ? require('../config-private') : require('../config')).config.token
};

if (dev) {
    options.execArgv = [ '-r', 'ts-node/register' ];
}

const shardManager = new ShardingManager('src/wuffy.ts', options);

shardManager.spawn();
shardManager.on('launch', shard => console.log(`Starting shard: ${shard.id}`));