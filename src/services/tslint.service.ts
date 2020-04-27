import { Linter, Configuration, LintResult } from 'tslint';
import { FileHelper } from '../util/files.helper';

export class TslintService {
    private configuration;
    private options;
    private linter: Linter;

    constructor() {
        this.configuration = Configuration.EMPTY_CONFIG;
        this.options = {
            formatter: 'json'
        };
    }

    setConfiguration(configurationFilePath: string, options?: any): boolean {
        if (!configurationFilePath) {
            console.error('TSLint configuration file not provided.\n');
            return false;
        } else {
            this.configuration = JSON.parse(FileHelper.getContent(configurationFilePath));
        }

        this.options = options ? options : this.options;
        this.linter = new Linter(this.options);
        return true;
    }

    analyseFile(filePath: string, fileContent: string): void {
        const config = Configuration.parseConfigFile(this.configuration);
        this.linter.lint(filePath, fileContent, config);
    }

    getResult(): LintResult { return this.linter.getResult(); }

    publishResult(): boolean {
        const results = this.getResult();

        if (!results.errorCount) {
            console.log('Success, all is fine !!!');
        } else {
            console.log(`${results.errorCount} warnings founds :`);
            const failureMap = new Map();
            results.failures.forEach(f => {
                const position = f.getStartPosition().getLineAndCharacter();
                const failure = {
                    error: f.getFailure(),
                    line: ++position.line,
                    character: position.character,
                    rule: f.getRuleName()
                };
                const key = f.getFileName();
                if (!failureMap.get(key)) {
                    failureMap.set(key, [failure]);
                } else {
                    failureMap.get(key).push(failure);
                }
            });

            failureMap.forEach((values, key) => {
                console.log(`\n${key}:`);
                console.group();
                console.table(values);
                console.groupEnd();
            });

            console.log(`\nDon't forget to add files after modifications !!!`);
        }
        console.log();

        return !!results.errorCount;
    }
}
