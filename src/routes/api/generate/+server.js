// @ts-nocheck
import { listAppliedResources, commitFiles } from './git';
import { jsonToCrossplane } from './translate';

export async function POST({ request }) {
  let resources = await request.json();

  resources.forEach(resource => {
    console.log('resources', resource.type + '-' + resource.data.name);
  });

  const OWNER = 'bray-rake';
  const REPO = 'rake-resources';
  const BRANCH = 'main';
  const MESSAGE = 'commit test';
  const PATH = 'infra/bray/resources/';

  // look: this approach will only be looking at files in github and not the actual state of the cluster. This will probably want to be changed in the future

  const oldFiles = await listAppliedResources(OWNER, REPO, PATH);
  console.log('oldfiles', oldFiles);

  const generatedResources = await jsonToCrossplane(resources);
  const generatedFiles = generatedResources.map(resource => resource.file);
  console.log('generatedFiles', generatedFiles);

  const delDiff = oldFiles.filter(item => !generatedFiles.includes(item));
  const newDiff = generatedFiles.filter(item => !oldFiles.includes(item));
  console.log('diff in old files vs new files (which files have been deleted)');
  console.log(delDiff);
  console.log(newDiff);

  // TODO: I should probably rework this to only be one commit
  if (delDiff.length > 0) {
    console.log('deleting, adding and committing...');

    const delResources = delDiff.map(file => {
      return {
        file: file,
        content: null
      };
    });
    // commit files with null content so that the file is deleted
    await commitFiles(OWNER, REPO, BRANCH, delResources, MESSAGE, PATH);
  }
  console.log('committing...');
  await commitFiles(OWNER, REPO, BRANCH, generatedResources, MESSAGE, PATH);

  return new Response(JSON.stringify({
    status: 200,
    body: 'success'
  }));
}