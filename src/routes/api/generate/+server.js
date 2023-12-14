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

  // try {
  //   await fs.writeFile('/Users/braypolkinghorne/Documents/code/Rake/testing/crossplane-learning/test.json', JSON.stringify(resources)); // Write the JSON string to a file

  //   let result = await new Promise((resolve, reject) => {
  //     exec('python3 /Users/braypolkinghorne/Documents/code/Rake/testing/crossplane-learning/translate.py run', (error, stdout, stderr) => {
  //       if (error) {
  //         console.error(`exec error: ${error}`);
  //         reject({
  //           status: 500,
  //           body: 'error'
  //         });
  //         return;
  //       }

  //       resolve({
  //         status: 200,
  //         body: 'success'
  //       });
  //       console.log(stdout);
  //     });
  //   });
  //   return new Response(JSON.stringify(result));
  // } catch (error) {
  //   console.error('Error:', error);
  //   return {
  //     status: 500,
  //     body: error
  //   };
  // }
}