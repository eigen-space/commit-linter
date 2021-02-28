import { Rule } from './common/types/rule';
import { Message } from './message/message';
import { ValidationList } from './valildation-list/validation-list';
import { Configuration } from './configuration/configuration';
import { Process } from './process/process';
import { StatusMessage } from './common/const/const';

export class Linter {

    validate(): void {
        this.applyValidations(
            ValidationList.checkForIgnoreMatching,
            ValidationList.checkForIssuePrefix,
            ValidationList.checkForBodies
        );

        Process.exitWithSuccess(StatusMessage.VALID);
    }

    private applyValidations(...rules: Rule[]): void {
        const config = new Configuration().get();
        const message = new Message();
        const tokens = message.parseTokens(config);
        return rules.forEach(rule => rule(config, tokens));
    }
}