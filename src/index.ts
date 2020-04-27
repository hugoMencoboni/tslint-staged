import { TslintService } from './services/tslint.service';
import { GitService } from './services/git.service';
import { FileHelper } from './util/files.helper';

async function tslintGitDiff(): Promise<void> {
    const config = await FileHelper.getConfig();

    const stagedFiles = await GitService.getStagedFiles(config);

    if (stagedFiles && stagedFiles.length) {
        console.log(`--------------- ${stagedFiles.length} ${stagedFiles.length === 1 ? 'file' : 'files'} to analyse ---------------`);
        stagedFiles.forEach(file => console.log(file.name));
        console.log('-'.repeat(50) + '\n');

        const tslintSrv = new TslintService();
        if (tslintSrv.setConfiguration(config.tslintConfig)) {
            stagedFiles.forEach(file => tslintSrv.analyseFile(file.path, file.content));
            if (tslintSrv.publishResult()) {
                process.exit(1);
            }
        }
    } else if (stagedFiles.length) {
        console.log('tslint-staged: no file to analyse.');
    }
}

tslintGitDiff();
