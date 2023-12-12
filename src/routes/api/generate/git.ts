import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
import yaml from 'js-yaml';

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

    // Create a tree with the blobs
    const tree = await octokit.git.createTree({
      owner,
      repo,
      base_tree: shaBaseTree,
      tree: files.map(({ content, file }) => (
        content
          ? { path: path + file, content: yaml.dump(content), mode: '100644', type: 'blob' } // Works for text files, utf-8 assumed
          : { path: path + file, sha: null, mode: '100644', type: 'blob' } // If sha is null => the file gets deleted
      )),
    });


    // Create a new commit with the tree
    const newCommit = await octokit.git.createCommit({
      owner,
      repo,
      message: message,
      tree: tree.data.sha,
      parents: [shaBaseTree],
    });

    // Update the reference of the branch to point to the new commit
    const res = await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.data.sha,
    });
  } catch (error) {
    console.error(`Error creating commit: ${error}`);
  }
}

export async function listAppliedResources(owner, repo, path) {
  try {
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path
    });

    octokit.git.tree

    if (Array.isArray(response.data)) {
      response.data.forEach(file => {
        console.log(file.name);
      });
    } else {
      // If the path is a file, this will be hit
      console.log('The specified path is a file, not a folder.');
    }
  } catch (error) {
    console.error(`Error fetching contents: ${error}`);
  }
}