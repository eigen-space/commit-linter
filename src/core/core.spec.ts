import { validate } from './core';
import Process = NodeJS.Process;
import Mock = jest.Mock;

// File: config.test.json
// {
//    "extends": ".commit-linter.config.json",
//    "issuePrefixes": ["proposal/[a-z-]+", "#[0-9]+", "TAX-[0-9]+"]
// }
//

// File: .commit-linter-config.json
// {
//    "body": "^([a-z\/, ]+?): (([a-z]+?ed|set|reset|draft) [a-z A-Z 0-9,]+)$",
//    "issuePrefixes": ["microfix"],
//    "ignore": ["^Merge .*", "^auto/.*"]
// }

describe('Core', () => {

    beforeEach(() => {
        process = prepareConfig(process) as Process;
    });

    it('should be failed with errored body, empty prefix and a lack of module', () => {
        process = commitWith('some error message', process);
        expect(() => validate()).toThrowError();
    });

    it('should be failed if there is a lack of issue prefix', () => {
        process = commitWith('common: changed structure of project', process);
        expect(() => validate()).toThrowError();
    });

    it('should be failed with present tense verb', () => {
        process = commitWith('#12 common: fix problem', process);
        expect(() => validate()).toThrowError();
    });

    it('should be passed with correct message in nested module', () => {
        process = commitWith('#12 actions/panel: fixed opening cards', process);
        expect(() => validate()).not.toThrowError();
    });

    it('should be failed if issue prefix is not in file', () => {
        process = commitWith('COREUI-20 actions/panel: fixed opening cards', process);
        expect(() => validate()).toThrowError();
    });

    it('should be passed if issue prefix is in file', () => {
        process = commitWith('TAX-228 actions/panel: fixed opening cards', process);
        expect(() => validate()).not.toThrowError();
    });

    it('should be passed if alternative issue prefix is in file', () => {
        process = commitWith('proposal/commit-linter common: added library', process);
        expect(() => validate()).not.toThrowError();
    });

    it('should be passed if issue prefix is in file', () => {
        process = commitWith('TAX-228 actions/panel: fixed opening cards', process);
        expect(() => validate()).not.toThrowError();
    });

    it('should be failed if issue prefix is written in different case', () => {
        process = commitWith('tax-228 actions/panel: fixed opening cards', process);
        expect(() => validate()).toThrowError();
    });

    it('should be failed if action starts with capital letter', () => {
        process = commitWith('TAX-228 actions/panel: Fixed opening cards', process);
        expect(() => validate()).toThrowError();
    });

    it('should be passed if commit message includes big letters and points in the middle', () => {
        process = commitWith('#12 common: added rule about proposals to README.md', process);
        expect(() => validate()).not.toThrowError();
    });

    it('should be failed if there is a point in the end of commit message', () => {
        process = commitWith('#12 common: removed all errors.', process);
        expect(() => validate()).toThrowError();
    });

    it('should be passed with correct message in multiple modules', () => {
        process = commitWith('#12 actions: fixed opening cards; common/icons: added close icon', process);
        expect(() => validate()).not.toThrowError();
    });

    it('should be passed with ignore pattern in merge', () => {
        process = commitWith('Merge branch \'dev\'', process);
        expect(() => validate()).not.toThrowError();
    });

    it('should be passed with ignore pattern in auto', () => {
        process = commitWith('auto/ci: set version 1.2.5', process);
        expect(() => validate()).not.toThrowError();
    });

    it('should be failed if there are no body', () => {
        process = commitWith('#12 actions', process);
        expect(() => validate()).toThrowError();
    });

    it('should be passed with microfix issue prefix', () => {
        process = commitWith('microfix common: fixed dependency number', process);
        expect(() => validate()).not.toThrowError();
    });

    it('should be passed for config without prefixes', () => {
        process = prepareConfig(
            process,
            './src/core/spec-assets/spec.config.without-prefix.json'
        ) as Process;

        process = commitWith('cards: fixed padding in title', process);

        expect(() => validate()).not.toThrowError();
    });

    function prepareConfig(process: Process, customConfigPath?: string): Process | { exit: Mock<number> } {
        const config = customConfigPath || './src/core/spec-assets/spec.config.json';

        return {
            ...process,
            argv: [...process.argv, `--config=${config}`],
            exit: jest.fn()
        };
    }

    function commitWith(message: string, process: Process): Process {
        return {
            ...process,
            argv: [...process.argv, `--message=${message}`]
        } as Process;
    }
});
