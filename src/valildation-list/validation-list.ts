import { Process } from '../process/process';
import { ErrorMessage, StatusMessage, StringValue } from '../common/const/const';
import { TokenDictionary } from '../common/types/token-dictionary';
import { Config } from '../common/types/config';

export class ValidationList {

    /**
     * Exit from process with code 0 if commit message matches with some of ignore patterns.
     *
     * For instance, if there is a ignore pattern '^Merge .*' commit with message "Merge to dev" will
     * be accepted.
     *
     * @param config
     * @param wholeString
     */
    static checkForIgnoreMatching(config: Config, { wholeString = '' }: TokenDictionary): void {
        if ((config.ignore || []).some(rule => wholeString.match(rule))) {
            Process.exitWithSuccess(StatusMessage.VALID);
        }
    }

    /**
     * Exit from process with error code if issue prefix doesn't match any of patterns.
     *
     * @param config
     * @param issuePrefix
     */
    static checkForIssuePrefix(config: Config, { issuePrefix = '' }: TokenDictionary): void {
        if ((config.issuePrefixes || []).some(value => issuePrefix.match(value))) {
            return;
        }

        Process.exitWithError(
            ErrorMessage.ISSUE_PREFIX_ERROR.replace(StringValue.ISSUE_PREFIX, issuePrefix)
                .replace(StringValue.DOC_LINK, config.linkToRule as string)
        );
    }

    /**
     * Exit from process with error code if at least one of bodies doesn't match rule.
     * Also prints in console list of not matched bodies.
     *
     * @param config
     * @param bodies
     */
    static checkForBodies(config: Config, { bodies = [] }: TokenDictionary): void {
        if (bodies.every(body => body.match(config.body as RegExp))) {
            return;
        }

        const notMatchedBodies = bodies.filter(body => !body.match(config.body as RegExp));
        Process.exitWithError(
            ErrorMessage.BODIES_ERROR.replace(StringValue.BODIES, notMatchedBodies.join('", "'))
                .replace(StringValue.DOC_LINK, config.linkToRule as string)
        );
    }
}
