import { GitFile } from './gitFile.model';
import { CONST } from '../../util/git.const';

export class GitBlobFile extends GitFile {
    constructor() {
        super(CONST.GIT_BLOB);
    }
}
