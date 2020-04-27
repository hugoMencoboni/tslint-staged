import { GitFile } from './gitFile.model';
import { CONST } from '../../util/git.const';

export class GitTreeFile extends GitFile {
    childs: Array<GitTreeChild>;
    constructor(childs: Array<GitTreeChild>) {
        super(CONST.GIT_TREE);
        this.childs = childs;
    }
}

export class GitTreeChild extends GitFile {
    size?: string;
    name?: string;
}
