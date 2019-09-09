const lib = require('../lib');
const { ArgumentParser } = require('@eigenspace/argument-parser');

const DEFAULT_COMMIT_CONFIG_PATH = '.commit-lint.config.json';

const SUCCESS_MESSAGE = '✔ Commit is valid';

const ERROR_PREFIX = '✘ Commit error: \n';
const REFERENCE_TO_DOC = 'Please, read: https://github.com/eigen-space/codestyle/tree/dev/doc/common#512-сообщение-к-изменению';
const ISSUE_PREFIX_ERROR = `${ERROR_PREFIX} Issue prefix ":0" doesn\'t match the requirements. \n ${REFERENCE_TO_DOC}`;
const BODIES_ERROR = `${ERROR_PREFIX} These bodies: ":0" don\'t match the requirements. \n ${REFERENCE_TO_DOC}`;

function validate() {
    const config = getConfig();
    const commitMessage = lib.getCommitMessage();
    const tokens = getTokensFrom(commitMessage);

    checkForIgnoreMatching(config, tokens);
    checkForIssuePrefix(config, tokens);
    checkForBodies(config, tokens);

    lib.exitWithSuccess(SUCCESS_MESSAGE);
}

function getConfig() {
    const parser = new ArgumentParser();
    const args = parser.get(process.argv.slice(2));

    const configPath = args.get('config') || DEFAULT_COMMIT_CONFIG_PATH;

    const sourceConfig = lib.getConfigContentFrom(configPath);
    const extendedConfig = lib.getConfigContentFrom(sourceConfig.extends) || {};

    return lib.merge(sourceConfig, extendedConfig);
}

function getTokensFrom(message) {
    const wholeString = message;
    const [issuePrefix, ...rest] = message.split(' ');
    const bodies = rest.join(' ')
        .split(';')
        .map(body => body.trim());

    return { wholeString, issuePrefix, bodies };
}

function checkForIgnoreMatching(config, { wholeString }) {
    if ((config.ignore || []).some(rule => wholeString.match(rule))) {
        lib.exitWithSuccess(SUCCESS_MESSAGE);
    }
}

function checkForIssuePrefix(config, { issuePrefix }) {
    if ((config.issuePrefixes || []).some(value => issuePrefix.match(value))) {
        return;
    }

    lib.exitWithError(ISSUE_PREFIX_ERROR.replace(':0', issuePrefix));
}

function checkForBodies(config, { bodies }) {
    if (bodies.every(body => body.match(config.body))) {
        return;
    }

    const notMatchedBodies = bodies.filter(body => !body.match(config.body));
    lib.exitWithError(BODIES_ERROR.replace(':0', notMatchedBodies.join('", "')));
}

module.exports = { validate };
