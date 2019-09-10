import { Config } from '../types';
import { TokenDictionary } from './core.interface';
import { exitWithSuccess, getCommitMessage, getConfig } from '../lib';
import { StatusMessage } from '../common/const';
import { checkForBodies, checkForIgnoreMatching, checkForIssuePrefix } from '../linter';

/**
 * A main function for commit linting. If there are no any errors exit process with 0, else with 1.
 */
export function validate(): void {
    const config = getConfig();
    const commitMessage = getCommitMessage();
    const tokens = getTokensFrom(commitMessage, config);

    checkForIgnoreMatching(config, tokens);
    checkForIssuePrefix(config, tokens);
    checkForBodies(config, tokens);

    exitWithSuccess(StatusMessage.VALID);
}

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
function getTokensFrom(message: string, config: Config): TokenDictionary {
    const wholeString = message;

    const hasIssuePrefixes = config.issuePrefixes && !config.issuePrefixes.includes('.*');
    const [issuePrefix, ...rest] = hasIssuePrefixes ? message.split(' ') : ['', message];
    const bodies = rest.join(' ')
        .split(';')
        .map(body => body.trim());

    return { wholeString, issuePrefix, bodies };
}
