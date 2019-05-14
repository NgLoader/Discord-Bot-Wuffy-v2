import { message } from '../events/message';
import { ready } from '../events/ready';
import { Wuffy } from '../wuffy';

interface EventHandler {
    (this: Wuffy): void;
}

export const eventHandler: EventHandler = function() {
    this.on('message', message.bind(this));
    this.on('ready', ready.bind(this));
};
