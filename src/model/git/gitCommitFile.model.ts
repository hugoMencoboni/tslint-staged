import { GitFile } from './gitFile.model';
import { CONST } from '../../util/git.const';

export class GitCommitFile extends GitFile {
    tree: string;
    parent: string;
    author: string;

    constructor() {
        super(CONST.GIT_COMMIT);
    }
}
