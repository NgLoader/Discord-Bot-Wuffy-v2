import { ShardingManager } from 'discord.js';
import fs from 'fs';

const options: any = {
    token: (JSON.parse(fs.readFileSync('./config.json') as unknown as string)).token
};

const shardManager = new ShardingManager('wuffy.js', options);

shardManager.spawn();
shardManager.on('launch', shard => console.log(`Starting shard: ${shard.id}`));