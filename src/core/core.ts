import { Config, Dictionary } from '../types';
import { TokenDictionary } from './core.interface';
import { exitWithError, exitWithSuccess, getCommitMessage, getConfigContentFrom, merge } from '../lib';
import { StringValue } from './core.const';

const { ArgumentParser } = require('@eigenspace/argument-parser');

const DEFAULT_COMMIT_CONFIG_PATH = '.commit-lint.config.json';

const SUCCESS_MESSAGE = '✔ Commit is valid';

const ERROR_PREFIX = '✘ Commit error: \n';
const REFERENCE_TO_DOC = `Please, read: ${StringValue.DOC_LINK}`;
const ISSUE_PREFIX_ERROR = `${ERROR_PREFIX} Issue prefix "${StringValue.ISSUE_PREFIX}" doesn\'t match the requirements. 
\n ${REFERENCE_TO_DOC}`;
const BODIES_ERROR = `${ERROR_PREFIX} These bodies: "${StringValue.BODIES}" don\'t match the requirements. 
\n ${REFERENCE_TO_DOC}`;

export function validate(): void {
    const config = getConfig();
    const commitMessage = getCommitMessage();
    const tokens = getTokensFrom(commitMessage, config);

    checkForIgnoreMatching(config, tokens);
    checkForIssuePrefix(config, tokens);
    checkForBodies(config, tokens);

    exitWithSuccess(SUCCESS_MESSAGE);
}

function getConfig(): Config {
    const parser = new ArgumentParser();
    const args = parser.get(process.argv.slice(2));

    const configPath = args.get('config') || DEFAULT_COMMIT_CONFIG_PATH;

    const sourceConfig = getConfigContentFrom(configPath) || {} as Config;
    const extendedConfig = getConfigContentFrom(sourceConfig.extends) || {} as Config;

    return merge(sourceConfig as Dictionary, extendedConfig as Dictionary);
}

function getTokensFrom(message: string, config: Config): TokenDictionary {
    const wholeString = message;

    const hasIssuePrefixes = config.issuePrefixes && !config.issuePrefixes.includes('.*');
    const [issuePrefix, ...rest] = hasIssuePrefixes ? message.split(' ') : ['', message];
    const bodies = rest.join(' ')
        .split(';')
        .map(body => body.trim());

    return { wholeString, issuePrefix, bodies };
}

function checkForIgnoreMatching(config: Config, { wholeString = '' }: TokenDictionary): void {
    if ((config.ignore || []).some((rule: string) => wholeString.match(rule))) {
        exitWithSuccess(SUCCESS_MESSAGE);
    }
}

function checkForIssuePrefix(config: Config, { issuePrefix = '' }: TokenDictionary): void {
    if ((config.issuePrefixes || []).some(value => issuePrefix.match(value))) {
        return;
    }

    exitWithError(
        ISSUE_PREFIX_ERROR.replace(StringValue.ISSUE_PREFIX, issuePrefix)
            .replace(StringValue.DOC_LINK, config.linkToRule as string)
    );
}

function checkForBodies(config: Config, { bodies = [] }: TokenDictionary): void {
    if (bodies.every(body => body.match(config.body as RegExp))) {
        return;
    }

    const notMatchedBodies = bodies.filter(body => !body.match(config.body as RegExp));
    exitWithError(
        BODIES_ERROR.replace(StringValue.BODIES, notMatchedBodies.join('", "'))
            .replace(StringValue.DOC_LINK, config.linkToRule as string)
    );
}
