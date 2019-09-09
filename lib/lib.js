const fs = require('fs');
const { ArgumentParser } = require('@eigenspace/argument-parser');

function exitWithSuccess(message) {
    // eslint-disable-next-line no-console
    console.info(message);
    process.exit(0);
}

function exitWithError(message) {
    // eslint-disable-next-line no-console
    console.error(message);
    process.exit(1);
}

function getCommitMessage() {
    const parser = new ArgumentParser();
    const args = parser.get(process.argv);

    const message = args.get('message');

    if (message === 'COMMIT_MESSAGE') {
        return fs.readFileSync('.git/COMMIT_EDITMSG', 'utf8');
    }

    return message;
}

function getConfigContentFrom(path) {
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

function merge(...objects) {
    const isObject = obj => obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
        Object.keys(obj)
            .forEach(key => {
                const pVal = prev[key];
                const oVal = obj[key];

                if (Array.isArray(pVal) && Array.isArray(oVal)) {
                    prev[key] = pVal.concat(...oVal);
                } else if (isObject(pVal) && isObject(oVal)) {
                    prev[key] = merge(pVal, oVal);
                } else {
                    prev[key] = oVal;
                }
            });

        return prev;
    }, {});
}

module.exports = {
    exitWithError,
    exitWithSuccess,
    getCommitMessage,
    getConfigContentFrom,
    merge
};
