export class BitBuffer {

    static DEFAULT_SIZE = 1024;

    buffer: Buffer;

    constructor(argument: number | Buffer) {
        if (argument instanceof Buffer) {
            this.buffer = argument;
        } else {
            this.buffer = Buffer.alloc(Math.ceil(argument / 8));
            this.buffer.fill(0);
        }
    }

    get(index: number) {
        return (this.buffer[index >>> 3] & (1 << (index % 8))) !== 0;
    }

    set(index: number, value: boolean) {
        const position = index >>> 3;
        if (value) {
            this.buffer[position] |= (1 << (index % 8));
        } else {
            this.buffer[position] &= ~(1 << (index % 8));
        }
    }
}