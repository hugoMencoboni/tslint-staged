import * as pathListToTree from 'path-list-to-tree';
import * as simpleGit from 'simple-git/promise';

import { GitFile } from '../model/git/gitFile.model';
import { GitCommitFile } from '../model/git/gitCommitFile.model';
import { GitTreeFile, GitTreeChild } from '../model/git/gitTreeFile.model';
import { GitBlobFile } from '../model/git/gitBlobFile.model';
import { GitStagedFile } from '../model/git/gitStagedFile.model';
import { TreeNode } from '../model/files/TreeNode.model';
import { FileHelper } from '../util/files.helper';
import { CONST } from '../util/git.const';

export class GitService {
    private static git = simpleGit();

    private static readonly _GITSIMPLE_BREAKLINE = '\n';
    private static readonly _GITSIMPLE_SPACE = ' ';

    /**
     * Get current staged files
     *
     * @returns {Array<GitFile>}
     */
    static async getStagedFiles(options?): Promise<Array<GitStagedFile>> {
        // Find the staged files and there paths
        let stagedFiles = await this._getStagesFiles();

        stagedFiles = FileHelper.filePathFilter(stagedFiles, options ? options.include : undefined, options ? options.exclude : undefined);

        const stagedFilesTreePath = pathListToTree.default(stagedFiles);

        // Generate tree sha
        const treeSHA = await this._writeTree();
        const repoTree = await this._getGitFile(treeSHA);

        return await this._getFileContent((stagedFilesTreePath as Array<TreeNode>), (repoTree as GitTreeFile));
    }

    /**
     * Get files content from a pathTree and the coresponding git tree
     *
     * @param {TreeNode} pathTree
     * @param {GitTreeFile} gitTree
     * @returns {Array<GitFile>}
     */
    static async _getFileContent(
        pathTree: Array<TreeNode>,
        gitTree: GitTreeFile,
        result: Array<GitStagedFile> = []): Promise<Array<GitStagedFile>> {

        for (let index = 0; index < pathTree.length; index++) {
            const childGitFile = gitTree.childs.find(chld => chld.name === pathTree[index].name);
            if (childGitFile.type === CONST.GIT_TREE && pathTree[index].children.length > 0) {
                const childGitTree = (await this._getGitFile(childGitFile.sha) as GitTreeFile);
                const childsTree = pathTree[index].children.map(chl => {
                    const path = (pathTree[index].path ? pathTree[index].path + '/' : '') + chl.name;
                    return new TreeNode(chl, path);
                });

                await this._getFileContent(childsTree, childGitTree, result);
            } else if (childGitFile.type === CONST.GIT_BLOB && pathTree[index].children.length === 0) {
                const fileBlob = (await this._getGitFile(childGitFile.sha) as GitBlobFile);
                const fileStageInfo: GitStagedFile = {
                    sha: fileBlob.sha,
                    type: CONST.GIT_BLOB,
                    name: childGitFile.name,
                    content: fileBlob.content,
                    path: pathTree[index].path
                };

                result.push(fileStageInfo);
            } else {
                throw new Error('File "' + pathTree[index].name + '" not found');
            }
        }

        return result;
    }

    /**
     * Get the path of all staged files
     *
     * @returns {Array<string>} list of paths
     */
    private static async _getStagesFiles(): Promise<Array<string>> {
        const status = await this.git.status();
        return [...status.staged, ...status.created];
    }

    /**
     * Write tree git command
     *
     * @returns {Promise<string>} sha of the tree
     */
    private static async _writeTree(): Promise<string> {
        const sha = await this.git.raw(['write-tree']);
        return sha ? sha.trim() : null;
    }

    /**
     * Get informations of a git file
     *
     * @param {string} sha
     * @returns {Promise<GitFile|GitCommitFile|GitTreeFile>} Information of the git file
     */
    private static async _getGitFile(sha: string): Promise<GitFile | GitCommitFile | GitTreeFile> {
        let type = await this.git.catFile([sha, '-t']);
        const content = await this.git.catFile([sha, '-p']);
        type = type ? type.trim() : null;

        switch (type) {
            case CONST.GIT_COMMIT:
                return this._readCommit(content, sha);
            case CONST.GIT_TREE:
                return this._readTree(content, sha);
            case CONST.GIT_BLOB:
                return this._readBlob(content, sha);
            default:
                return;
        }
    }

    /**
     * Get informations of a git commit file
     *
     * @param {string} content
     * @param {string} sha
     * @returns {GitCommitFile}
     */
    private static _readCommit(content: string, sha: string = null): GitCommitFile {
        const lines = content.split(this._GITSIMPLE_BREAKLINE);
        const elements = lines ? lines.map(l => l.split(this._GITSIMPLE_SPACE)) : null;

        const tree = elements.find(elm => elm[0] === CONST.GIT_TREE)[1];
        const parent = elements.find(elm => elm[0] === CONST.GIT_PARENT)[1];
        const author = elements.find(elm => elm[0] === CONST.GIT_AUTHOR)[1];

        return {
            type: CONST.GIT_COMMIT,
            sha,
            content,
            parent,
            author,
            tree,
        };
    }

    /**
     * Get informations of a git tree file
     *
     * @param {string} content
     * @param {string} sha
     * @returns {GitTreeFile}
     */
    private static _readTree(content: string, sha: string = null): GitTreeFile {
        const elements = content.split(this._GITSIMPLE_BREAKLINE);

        const childs = new Array<GitTreeChild>();
        elements.forEach(elm => {
            if (elm) {
                const [size, type, childSha, name] = elm.split(/ |	/);
                childs.push({ size, type, sha: childSha, name });
            }
        });

        return { type: CONST.GIT_TREE, sha, content, childs };
    }

    /**
     * Get informations of a git blob file
     *
     * @param {string} content
     * @param {string} sha
     * @returns {GitFile}
     */
    private static _readBlob(content: string, sha: string = null): GitBlobFile {
        return { type: CONST.GIT_BLOB, sha, content };
    }
}
