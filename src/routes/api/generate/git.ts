import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import YAML from 'yaml';

interface File {
  file: string;
  content: string;
}

dotenv.config();
const octokit = new Octokit({
  auth: process.env.GITHUB_PAT
});

export async function commitFiles(owner: string, repo: string, branch: string, files: File[], message: string, path: string): Promise<void> {
  try {
    // Get the reference of the branch you want to update
    const branchRef = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    const shaBaseTree = branchRef.data.object.sha;
    console.log('shaBaseTree', shaBaseTree);
    // Create a tree with the blobs
    const tree = await octokit.git.createTree({
      owner,
      repo,
      base_tree: shaBaseTree,
      tree: files.map(({ content, file }) => (
        content
          ? { path: path + file, content: YAML.stringify(content), mode: '100644', type: 'blob' } // Works for text files, utf-8 assumed
          : { path: path + file, sha: null, mode: '100644', type: 'blob' } // If content is null => the file gets deleted
      )),
    });
    console.log('tree', tree);

    // Create a new commit with the tree
    const newCommit = await octokit.git.createCommit({
      owner,
      repo,
      message: message,
      tree: tree.data.sha,
      parents: [shaBaseTree],
    });
    console.log('newCommit');

    // Update the reference of the branch to point to the new commit
    const res = await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.data.sha,
    });
    console.log(res);
  } catch (error) {
    console.error(`Error creating commit: ${error}`);
  }
}

// list current files in github
export async function listAppliedResources(owner: string, repo: string, path: string) {
  try {
    // Get the SHA of the latest commit on the default branch (e.g., 'main')
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: 'heads/main'
    });
    const commitSha = refData.object.sha;

    // Get the tree associated with the commit SHA recursively
    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: commitSha,
      recursive: 'false'
    });

    // filter items by path
    const fileNames = treeData.tree.filter(item => item.path.startsWith(path)).map(obj => obj.path?.substring(obj.path.indexOf(path) + path.length));
    return fileNames;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
}