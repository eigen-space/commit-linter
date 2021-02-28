import { ArgumentParser } from '@eigenspace/argument-parser';
import fs from 'fs';
import { ObjectUtils } from '../common/utils/object.utils';
import { Process } from '../process/process';
import { Config } from '../common/types/config';

export class Configuration {
    private static DEFAULT_COMMIT_CONFIG_PATH = '.commit-linter.config.json';

    get(): Config {
        const parser = new ArgumentParser();
        const args = parser.get(process.argv.slice(2));

        const configPath = args.get('config') as string || Configuration.DEFAULT_COMMIT_CONFIG_PATH;

        let currentConfig = this.readFromFile(configPath) as Config;
        const configs = [currentConfig];

        while (currentConfig.extends) {
            currentConfig = this.readFromFile(currentConfig.extends) as Config;
            configs.push(currentConfig);
        }

        return ObjectUtils.merge<Config>(...configs);
    }

    // noinspection JSMethodCanBeStatic
    private readFromFile(path?: string): Config | undefined {
        if (!path) {
            return;
        }

        let config = {};
        try {
            const content = fs.readFileSync(path, 'utf8');
            config = JSON.parse(content);
        } catch (err) {
            Process.exitWithError(`Failed to load ${path}`);
            return;
        }

        return config;
    }
}