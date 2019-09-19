import { ArgumentParser } from '@eigenspace/argument-parser';
import fs from 'fs';
import { Config, Dictionary } from '../types';

/**
 * Exit from process with success and print info message in console
 *
 * @param message
 */
function exitWithSuccess(message: string): void {
    console.info(message);
    process.exit(0);
}

/**
 * Exit from process with error message and print error message in console
 *
 * @param message
 */
function exitWithError(message: string): void {
    console.error(message);
    process.exit(1);
}

const DEFAULT_COMMIT_CONFIG_PATH = '.commit-linter.config.json';

/**
 * Returns merged all chain of configs.
 */
export function getConfig(): Config {
    const parser = new ArgumentParser();
    const args = parser.get(process.argv.slice(2));

    const configPath = args.get('config') as string || DEFAULT_COMMIT_CONFIG_PATH;

    let currentConfig = getConfigContentFrom(configPath) as Config;
    const configs = [currentConfig];

    while (currentConfig.extends) {
        currentConfig = getConfigContentFrom(currentConfig.extends) as Config;
        configs.push(currentConfig);
    }

    return merge<Config>(...configs);
}

/**
 * Get commit message.
 * If COMMIT_MESSAGE_VARIABLE const given as argument of message,
 * returns value from user's commit message from git environment.
 * In other cases returns value.
 */
function getCommitMessage(): string {
    const COMMIT_MESSAGE_VARIABLE = 'COMMIT_MESSAGE';

    const parser = new ArgumentParser();
    const args = parser.get(process.argv);

    const message = args.get('message') as string;

    if (message === COMMIT_MESSAGE_VARIABLE) {
        return fs.readFileSync('.git/COMMIT_EDITMSG', 'utf8');
    }

    return message;
}

/**
 * Read JSON config from file.
 *
 * @param path
 */
function getConfigContentFrom(path?: string): Config | undefined {
    if (!path) {
        return;
    }

    let config = {};
    try {
        const content = fs.readFileSync(path, 'utf8');
        config = JSON.parse(content);
    } catch (err) {
        exitWithError(`Failed to load ${path}`);
        return;
    }

    return config;
}

/**
 * Deeply merge input objects in single.
 *
 * @param objects
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function merge<T>(...objects: any[]): T {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isObject = (obj: any): boolean => obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
        const result = { ...prev };

        Object.keys(obj)
            .forEach(key => {
                const pVal = prev[key];
                const oVal = obj[key];

                if (Array.isArray(pVal) && Array.isArray(oVal)) {
                    result[key] = pVal.concat(...oVal);
                } else if (isObject(pVal) && isObject(oVal)) {
                    result[key] = merge(pVal as Dictionary, oVal as Dictionary);
                    // Break the logic
                    // eslint-disable-next-line @eigenspace/script-rules/conditions
                } else {
                    result[key] = oVal;
                }
            });

        return result;
    }, {});
}

export {
    exitWithError,
    exitWithSuccess,
    getCommitMessage,
    getConfigContentFrom,
    merge
};
