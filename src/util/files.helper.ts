import * as fs from 'fs';
import * as readPkgUp from 'read-pkg-up';
import { filePathFilter } from '@jsdevtools/file-path-filter';
import { Config } from '../model/config.model';

export class FileHelper {
    static getContent(path: string, encoding = 'utf8'): string {
        return fs.readFileSync(path, { encoding });
    }

    static filePathFilter(paths: Array<string>, include: Array<string>, exclude: Array<string>): Array<string> {
        if ((include && include.length) || (exclude && exclude.length)) {
            return paths.filter(filePathFilter({ include, exclude }));
        }

        return paths;
    }

    static async getConfig() {
        const packageJsonResult = await readPkgUp();
        const packageJson = packageJsonResult ? packageJsonResult.packageJson : undefined;

        const config = new Config();
        if (packageJson && packageJson.tslintStaged) {
            config.tslintConfig = packageJson.tslintStaged.tslintConfig;
            config.include = packageJson.tslintStaged.include;
            config.exclude = packageJson.tslintStaged.exclude;
        }

        return config;
    }
}
