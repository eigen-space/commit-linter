import { Config } from '../types';
import { TokenDictionary } from '../core/core.interface';

/**
 * Parse tokens from commit message.
 * | COREUI-220123 common: added the ability to parse library; card: added user |
 * | <whole string                                                           >  |
 * | <issue prefix> <bodies                                                  >  |
 * |                <body 1                                  ><body 2        >  |
 *
 * @param message
 * @param config
 */
export function getTokensFrom(message: string, config: Config): TokenDictionary {
    const wholeString = message;

    const hasIssuePrefixes = config.issuePrefixes && !config.issuePrefixes.includes('.*');
    const [issuePrefix, ...rest] = hasIssuePrefixes ? message.split(' ') : ['', message];
    const bodies = rest.join(' ')
        .split(';')
        .map(body => body.trim());

    return { wholeString, issuePrefix, bodies };
}