import { checkForIssuePrefix } from './linter';

describe('Linter', () => {

    describe('#checkForIssuePrefix', () => {

        it('should pass validating prefix', () => {
            const config = { issuePrefixes: ['SC-[0-9]+'] };
            const result = checkForIssuePrefix(config, { issuePrefix: 'SC-123' });
            expect(result).toBeNull();
        });

        it('should return error for a prefix in another case', () => {
            const config = { issuePrefixes: ['SC-[0-9]+'] };

            const result = checkForIssuePrefix(config, { issuePrefix: 'sc-123' });

            expect(result).toBeDefined();
            expect(result).not.toBeNull();
        });
    });
});