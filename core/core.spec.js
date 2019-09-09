const { validate } = require('./core');

/** File: config.test.json
 * {
    "extends": ".commit-lint.config.json",
    "issuePrefixes": ["proposal/[a-z-]+", "#[0-9]+", "TAX-[0-9]+"]
}
 */

/** File: .commit-lint-config.json
 * {
    "body": "^([a-z\/, ]+?): (([a-z]+?ed|set|reset|draft) [a-z A-Z 0-9,]+)$",
    "issuePrefixes": ["microfix"],
    "ignore": ["^Merge .*", "^auto/.*"]
}
 */

describe('Core', () => {

    beforeEach(() => {
        process = prepareConfig(process);
        // eslint-disable-next-line no-console
        console.error = jest.fn();
        // eslint-disable-next-line no-console
        console.info = jest.fn();
    });

    it('should be failed', () => {
        process = commitWith('some error message', process);
        validate();
        expect(getFirstExitStatus(process)).toBe(1);
    });

    it('should be failed with present tense verb', () => {
        process = commitWith('#12 common: fix problem', process);
        validate();
        expect(getFirstExitStatus(process)).toBe(1);
    });

    it('should be passed with correct message in nested module', () => {
        process = commitWith('#12 actions/panel: fixed openening cards', process);
        validate();
        expect(getFirstExitStatus(process)).toBe(0);
    });

    it('should be failed if issue prefix is not in file', () => {
        process = commitWith('COREUI-20 actions/panel: fixed openening cards', process);
        validate();
        expect(getFirstExitStatus(process)).toBe(1);
    });

    it('should be passed if issue prefix is in file', () => {
        process = commitWith('TAX-228 actions/panel: fixed openening cards', process);
        validate();
        expect(getFirstExitStatus(process)).toBe(0);
    });

    it('should be passed if alternative issue prefix is in file', () => {
        process = commitWith('proposal/commit-lint common: added library', process);
        validate();
        expect(getFirstExitStatus(process)).toBe(0);
    });

    it('should be passed if issue prefix is in file', () => {
        process = commitWith('TAX-228 actions/panel: fixed openening cards', process);
        validate();
        expect(getFirstExitStatus(process)).toBe(0);
    });

    it('should be failed if action starts with capital letter', () => {
        process = commitWith('TAX-228 actions/panel: Fixed openening cards', process);
        validate();
        expect(getFirstExitStatus(process)).toBe(1);
    });

    it('should be passed with correct message in multiple modules', () => {
        process = commitWith('#12 actions: fixed openening cards; common/icons: added close icon', process);
        validate();
        expect(getFirstExitStatus(process)).toBe(0);
    });

    it('should be passed with ignore pattern in merge', () => {
        process = commitWith('Merge branch \'dev\'', process);
        validate();
        expect(getFirstExitStatus(process)).toBe(0);
    });

    it('should be passed with ignore pattern in auto', () => {
        process = commitWith('auto/ci: set version 1.2.5', process);
        validate();
        expect(getFirstExitStatus(process)).toBe(0);
    });

    it('should be passed with microfix issue prefix', () => {
        process = commitWith('microfix common: fixed dependency number', process);
        validate();
        expect(getFirstExitStatus(process)).toBe(0);
    });

    function getFirstExitStatus(process) {
        return process.exit.mock.calls[0][0];
    }

    function prepareConfig(process) {
        return {
            ...process,
            argv: [...process.argv, '--config=.config.test.json'],
            exit: jest.fn()
        };
    }

    function commitWith(message, process) {
        return {
            ...process,
            argv: [...process.argv, `--message=${message}`]
        };
    }
});
