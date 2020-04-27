
import * as pathListToTree from 'path-list-to-tree';

export class TreeNode implements pathListToTree.TreeNode {
    name: string;
    children: pathListToTree.TreeNode[];
    path: string;

    constructor(treeNode?: pathListToTree.TreeNode, path?: string) {
        if (treeNode) {
            this.name = treeNode.name;
            this.children = treeNode.children;
        }

        this.path = path;
    }
}
