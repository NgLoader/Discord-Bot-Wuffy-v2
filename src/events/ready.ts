import { Wuffy } from '../wuffy';

interface ReadyListener {
    (this: Wuffy): void;
}

export const ready: ReadyListener = function() {
    if (this.shard === null) {
        console.info(`Wuffy is ready without sharding.`);
    } else {
        console.info(`Wuffy is ready on shard ${this.shard.id}/${this.shard.count}.`);
    }
};