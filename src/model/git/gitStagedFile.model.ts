import { GitBlobFile } from './gitBlobFile.model';

export class GitStagedFile extends GitBlobFile {
    name: string;
    path: string;
}
