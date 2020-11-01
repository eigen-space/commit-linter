import { getCommitMessage, getConfig } from '../lib';
import { checkForBodies, checkForIssuePrefix, isMessageShouldBeIgnored } from '../linter';
import { getTokensFrom } from '../token-extractor';

/**
 * A main function for commit linting.
 */
export function validate(): void {
    const config = getConfig();
    const commitMessage = getCommitMessage();
    const tokens = getTokensFrom(commitMessage, config);

    const isIgnored = isMessageShouldBeIgnored(config, tokens);

    if (isIgnored) {
        return;
    }

    const checkers = [checkForIssuePrefix, checkForBodies];

    checkers.forEach(checker => {
        const error = checker(config, tokens);
        if (error) {
            throw new Error(error);
        }
    });
        const error = checkers[i](config, tokens);
        if (error) {
            throw new Error(error);
        }
    }
}
