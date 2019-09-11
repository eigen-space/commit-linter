const { copy } = require('@eigenspace/helper-scripts');

const target = 'dist';
copy(
    [
        'package.json',
        'README.md',
        'yarn.lock',
        'cli.js',
        '.commit-linter.base.config.json'
    ],
    target
);
