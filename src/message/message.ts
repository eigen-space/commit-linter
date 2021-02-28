import { ArgumentParser } from '@eigenspace/argument-parser';
import fs from 'fs';
import { TokenDictionary } from '../common/types/token-dictionary';
import { Config } from '../common/types/config';

export class Message {
    private static ARG_NAME = 'message';
    private static COMMIT_MESSAGE_VARIABLE = 'COMMIT_MESSAGE';

    /**
     * Parse tokens from commit message.
     * | COREUI-220123 common: added the ability to parse library; card: added user |
     * | <whole string                                                           >  |
     * | <issue prefix> <bodies                                                  >  |
     * |                <body 1                                  ><body 2        >  |
     *
     * @param config
     */
    parseTokens(config: Config): TokenDictionary {
        const message = this.readMessageFromSystem();
        const wholeString = message;

        const hasIssuePrefixes = config.issuePrefixes && !config.issuePrefixes.includes('.*');
        const [issuePrefix, ...rest] = hasIssuePrefixes ? message.split(' ') : ['', message];
        const bodies = rest.join(' ')
            .split(';')
            .map(body => body.trim());

        return { wholeString, issuePrefix, bodies };
    }

    // noinspection JSMethodCanBeStatic
    private readMessageFromSystem(): string {
        const parser = new ArgumentParser();
        const args = parser.get(process.argv);

        const message = args.get(Message.ARG_NAME) as string;

        if (message === Message.COMMIT_MESSAGE_VARIABLE) {
            return fs.readFileSync('.git/COMMIT_EDITMSG', 'utf8');
        }

        return message;
    }
}