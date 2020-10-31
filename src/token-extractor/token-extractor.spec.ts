import { getTokensFrom } from './token-extractor';

describe('TokenExtractor', () => {

    describe('#getTokensFrom', () => {

        it('should extract issue prefix in upper case', () => {
            const config = { issuePrefixes: ['SC-[0-9]+'] };
            const message = 'SC-123 common: message';

            const result = getTokensFrom(message, config);

            expect(result.issuePrefix).toEqual('SC-123');
        });

        it('should extract issue prefix in lower case', () => {
            const config = { issuePrefixes: ['sc-[0-9]+'] };
            const message = 'sc-123 common: message';

            const result = getTokensFrom(message, config);

            expect(result.issuePrefix).toEqual('sc-123');
        });
    });
});