import { ArgumentParser } from '@eigenspace/argument-parser';
import fs from 'fs';
import { Config, Dictionary } from '../types';

function exitWithSuccess(message: string): void {
    console.info(message);
    process.exit(0);
}

function exitWithError(message: string): void {
    console.error(message);
    process.exit(1);
}

function getCommitMessage(): string {
    const parser = new ArgumentParser();
    const args = parser.get(process.argv);

    const message = args.get('message') as string;

    if (message === 'COMMIT_MESSAGE') {
        return fs.readFileSync('.git/COMMIT_EDITMSG', 'utf8');
    }

    return message;
}

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

function merge(...objects: Dictionary[]): Dictionary {
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
