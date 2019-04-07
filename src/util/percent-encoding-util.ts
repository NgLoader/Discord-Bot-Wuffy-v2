import { Collection } from 'discord.js';

export class PercentEncodingUtil {

    private static characters = new Map<RegExp, string>();

    static initialize() {
        // Reserved characters
        this.characters.set(/\!/g, '%21');
        this.characters.set(/\#/g, '%23');
        this.characters.set(/\$/g, '%24');
        this.characters.set(/\&/g, '%26');
        this.characters.set(/\'/g, '%27');
        this.characters.set(/\(/g, '%28');
        this.characters.set(/\)/g, '%29');
        this.characters.set(/\*/g, '%2A');
        this.characters.set(/\+/g, '%2B');
        this.characters.set(/\,/g, '%2C');
        this.characters.set(/\//g, '%2F');
        this.characters.set(/\:/g, '%3A');
        this.characters.set(/\;/g, '%3B');
        this.characters.set(/\=/g, '%3D');
        this.characters.set(/\?/g, '%3F');
        this.characters.set(/\@/g, '%40');
        this.characters.set(/\[/g, '%5B');
        this.characters.set(/\]/g, '%5D');

        // Common characters
        this.characters.set(/\s+/g, '%20');
        this.characters.set(/\"/g, '%22');
        this.characters.set(/\-/g, '%2D');
        this.characters.set(/\./g, '%2E');
        this.characters.set(/\</g, '%3C');
        this.characters.set(/\>/g, '%3E');
        this.characters.set(/\\/g, '%5C');
        this.characters.set(/\^/g, '%5E');
        this.characters.set(/\_/g, '%5F');
        this.characters.set(/\`/g, '%60');
        this.characters.set(/\{/g, '%7B');
        this.characters.set(/\|/g, '%7C');
        this.characters.set(/\}/g, '%7D');
        this.characters.set(/\~/g, '%7E');
    }

    static encode(message: string): string {
        for (const [key, value] of this.characters)
            message = message.replace(key, value);

        return message;
    }
}

PercentEncodingUtil.initialize();