export class GitFile {
    sha: string;
    type: string;
    content?: string;

    constructor(type: string) {
        this.type = type;
    }
}
