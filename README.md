# Commit-Lint

Don't allow developer push changes if commit message that doesn't correspond rules.
This is an alternative for [commitint](https://commitlint.js.org/). The main difference 
from this library is that it fully bases on [conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0-beta.4/).

This library based on [this rule](https://github.com/eigen-space/codestyle/tree/dev/doc/common#512-сообщение-к-изменению)
by default:
```
<issue prefix> <module 1>[/<sub-module>][, ..., <module N>[/<sub-module>]]: <content in past tense 1>[, 
..., <content in paste tense M>][; ...; <moduleK>[/<sub-module>]: <content in past tense>]
```

But you can also [set your own commit messages style](#configuration).

Example of commit with single changes: \
`TAX-20 header: added navigation bar`

Example of commit with multiple changes: \
`TAX-20 product/feedbacks: added the ability to set stars; user: supported history`

## Environmental requirements

* `husky`: `1.3.x`

## Quickstart

1. Just add this for your husky hooks in `package.json`:
    ```
   ...
    "husky": {
        "hooks": {
            ...
            "commit-msg": "commit-lint --message=COMMIT_MESSAGE"
            ...
        }
    }
   ...
    ```

2. Add `.commit-lint.config.json` in the root of your project and set your issue prefixes:
    ```
    {
        "extends": "@eigenspace/commit-lint/.commit-lint.config.json",
        "issuePrefixes": [
            "TAX/[a-z-]+"
        ]
    }
    ```

## Configuration

All configuration are in `.commit-lint.config.json` file:

#### extends

You can set file you want to extend from:
```
"extends": ".commit-lint.base.config.json",
```

#### body

For single change: \
`<task prefix> <content>`

For multiple changes: \
`<task prefix> <content 1>; <content 2>; <content N>`

For instance, you can override by your own regexp for commit body:
```
"body": "^([a-z\\/,\\- ]+?): (([a-z]+?ed|set|reset|draft) [a-z A-Z 0-9,]+)$",
```

#### issuePrefixes

It's like what your commit can start with. For instance, `#28`, `feature/cart`, `DXAPP-124` and 
so on.

Example of config: 
```
"issuePrefixes": ["microfix", "TAX-[0-9]+"],
```

#### ignore

You can set regex to ignore linting messages. For instance, it could be: \
`Merge dev in master` or `auto/ci: set version to 4.1.1`.

Default config is: 
```
"ignore": ["^Merge .*", "^auto/.*"]
```

#### linkToRule

This is a reference to page with rule description. By default there is a:
```
"linkToRule": "https://github.com/eigen-space/codestyle/tree/dev/doc/common#512-сообщение-к-изменению"
```

## Why do we have that dependencies?

* `@eigenspace/argument-parser` - parsing arguments from node process.

## Why do we have that dev dependencies?

* `@types/*` - contains type definitions for specific library.
* `@eigenspace/eslint-config-codestyle` - project with eslint config files.
* `@eigenspace/helper-scripts` - common scripts for dev. environment.
* `eslint` - it checks code for readability, maintainability, and functionality errors.
* `@eigenspace/codestyle` - includes lint rules, config for typescript.
* `husky` - used for configure git hooks.
* `ts-jest` - it lets you use Jest to test projects written in TypeScript.
* `jest` - testing.
* `lint-staged` - used for configure linters against staged git files.
* `typescript` - is a superset of JavaScript that have static type-checking and ECMAScript features.
