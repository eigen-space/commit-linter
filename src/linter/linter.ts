import { Config } from '../types';
import { TokenDictionary } from '../core/core.interface';
import { ErrorMessage, StringValue } from '../common/const';

type ValidationError = string;
type ValidationResult = ValidationError | null;

/**
 * Return true if message should be ignored.
 *
 * For instance, if there is a ignore pattern '^Merge .*' commit with message "Merge to dev" will
 * be accepted.
 *
 * @param config
 * @param wholeString
 */
export function isMessageShouldBeIgnored(config: Config, { wholeString = '' }: TokenDictionary): boolean {
    return (config.ignore || []).some((rule: string) => wholeString.match(rule));
}

/**
 * Return error message if checking was failed.
 *
 * @param config
 * @param issuePrefix
 */
export function checkForIssuePrefix(config: Config, { issuePrefix = '' }: TokenDictionary): ValidationResult {
    if ((config.issuePrefixes || []).some(value => issuePrefix.match(value))) {
        return null;
    }

    return ErrorMessage.ISSUE_PREFIX_ERROR.replace(StringValue.ISSUE_PREFIX, issuePrefix)
        .replace(StringValue.DOC_LINK, config.linkToRule as string);
}

/**
 * Return error message if checking was failed.
 *
 * @param config
 * @param bodies
 */
export function checkForBodies(config: Config, { bodies = [] }: TokenDictionary): ValidationResult {
    if (bodies.every(body => body.match(config.body as RegExp))) {
        return null;
    }

    const notMatchedBodies = bodies.filter(body => !body.match(config.body as RegExp));
    return ErrorMessage.BODIES_ERROR.replace(StringValue.BODIES, notMatchedBodies.join('", "'))
        .replace(StringValue.DOC_LINK, config.linkToRule as string);
}
