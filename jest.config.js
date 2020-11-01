module.exports = {
    clearMocks: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/core/index.ts',
        '!cli.ts'
    ],
    setupFiles: [
        '<rootDir>/config/jest/setup/console.setup.ts'
    ],
    coveragePathIgnorePatterns: [
        '.*\\.d\\.ts'
    ],
    testMatch: [
        '<rootDir>/src/**/*.spec.(ts|tsx)'
    ],
    modulePathIgnorePatterns: [
        '<rootDir>/dist/'
    ],
    testURL: 'http://localhost',
    transform: {
        '^.+\\.tsx?$': '<rootDir>/config/jest/transform/typescript.transform.js'
    },
    moduleFileExtensions: [
        'web.ts',
        'ts',
        'tsx',
        'web.js',
        'js',
        'json',
        'node'
    ],
    globals: {
        'ts-jest': { tsConfig: 'tsconfig.spec.json' }
    },
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 75,
            functions: 100,
            lines: 95,
            statements: 95
        }
    }
};
