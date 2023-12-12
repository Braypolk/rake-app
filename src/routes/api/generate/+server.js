// @ts-nocheck
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { json, text } from '@sveltejs/kit';
import yaml from 'js-yaml';
import { listAppliedResources, commitFiles } from './git';

function jsonToCrossplane(resources) {
  const idToPosition = resources.reduce((acc, obj, index) => {
    acc[obj.id] = index;
    return acc;
  }, {});

  let resourceList = [];

  resources.forEach(item => {
    let resource = {};
    switch (item['type']) {
      case 'Bucket':
        resource = {
          'apiVersion': 'storage.gcp.upbound.io/v1beta1',
          'kind': 'Bucket',
          'metadata': {
            'name': item['data']['name'],
            'namespace': 'default',
            'labels': {
              'kuttle-test': 'demo'
            }
          },
          'spec': {
            'deletionPolicy': 'Delete',
            'forProvider': {
              'location': item['data']['location'],
              'project': resources[idToPosition[item['project']]]['data']['name'],
              'publicAccessPrevention': item['data']['publicState'] ? 'inherited' : 'enforced',

            },
            'providerConfigRef': {
              'name': 'default',
            }
          },
        }
        break;
      case 'Network':
        resource = {
          'apiVersion': 'compute.gcp.upbound.io/v1beta1',
          'kind': 'Network',
          'metadata': {
            'name': item['data']['name'],
            'namespace': 'default',
            'labels': {
              'kuttle-test': 'demo'
            }
          },
          'spec': {
            'deletionPolicy': 'Delete',
            'forProvider': {
              'description': item['data']['description'],
              'deleteDefaultRoutesOnCreate': true,
              'autoCreateSubnetworks': false,
              'project': resources[idToPosition[item['project']]]['data']['name'],
              'routingMode': item['data']['routingMode']
            },
            'deletionPolicy': 'Delete'
          },
        }
        break;
      case 'Subnetwork':
        resource = {
          'apiVersion': 'compute.gcp.upbound.io/v1beta1',
          'kind': 'Subnetwork',
          'metadata': {
            'name': item['data']['name'],
            'namespace': 'default',
            'labels': {
              'kuttle-test': 'demo'
            }
          },
          'spec': {
            'deletionPolicy': 'Delete',
            'forProvider': {
              'ipCidrRange': item['data']['ipCidrRange'],
              'region': item['data']['region'],
              'networkRef': {
                'name': resources[idToPosition[item['project']]]['data']['name']
              },
              'project': resources[idToPosition[resources[idToPosition[item['project']]]['project']]]['data']['name'], // points to the network then points to the project that network lives in
            },
            'deletionPolicy': 'Delete'
          },
        }
        break;
      case "Instance":
        resource = {
          'apiVersion': 'compute.gcp.upbound.io/v1beta1',
          'kind': 'Instance',
          'metadata': {
            'name': item['data']['name'],
            'namespace': 'default',
            'labels': {
              'kuttle-test': 'demo'
            }
          },
          'spec': {
            'deletionPolicy': 'Delete',
            'forProvider': {
              'allowStoppingForUpdate': true,
              'networkInterface': [
                {
                  'networkRef': {
                    'name': resources[idToPosition[resources[idToPosition[item['data']['subnetwork']]]['project']]]['data']['name']
                  },
                  'subnetworkRef': {
                    'name': resources[idToPosition[item['data']['subnetwork']]]['data']['name']
                  }
                }
              ],
              'machineType': item['data']['machineType'],
              'bootDisk': [
                {
                  'initializeParams': [
                    {
                      'image': item['data']['bootDisk']
                    }
                  ]
                }
              ],
              'project': resources[idToPosition[item['project']]]['data']['name'],
              'zone': item['data']['zone']
            },
            'deletionPolicy': 'Delete'
          },
        }
        break;
      default:
        break;
    }

    if (resource != {}) {
      console.log(item['type'] + '-' + item['data']['name']);
      resourceList.push({ file: item['type'] + '-' + item['data']['name'] + '.yaml', content: resource });
    }
  });
  return resourceList;
}

// async function moveFilesInDirectory(bucketName, srcPrefix, destPrefix, files) {
//   const moveOptions = {
//     preconditionOpts: {
//       ifGenerationMatch: 0, //destinationGenerationMatchPrecondition
//     },
//   };

//   // List files in the source directory
//   // const [files] = await srcBucket.getFiles({ prefix: srcPrefix });

//   // Move each file to the destination directory
//   for (const file of files) {
//     await storage
//       .bucket(bucketName)
//       .file(srcPrefix + file)
//       .move(destPrefix + file, moveOptions);
//     console.log(`gs://${bucketName}/${srcPrefix}/${file} moved to gs://${bucketName}/${destPrefix}/${file}`);
//   }
// }


// async function deleteFile(bucketName, filename) {
//   const deleteOptions = {
//     ifGenerationMatch: 0, //generationMatchPrecondition
//   };
//   // Deletes the file from the bucket
//   await storage
//     .bucket(bucketName)
//     .file(filename)
//     .delete(deleteOptions);
//   console.log(`gs://${bucketName}/${filename} deleted.`);
// }



export async function POST({ request }) {
  let resources = await request.json();

  // console.log(resources);

  const OWNER = 'bray-rake'; // Replace with the repository owner
  const REPO = 'rake-resources';  // Replace with the repository name
  const BRANCH = 'main'; // Replace with the branch you want to commit to
  const MESSAGE = 'commit test'; // Replace with your commit message
  const PATH = 'bray/resources/'
  // const resourceLocation = 'bray/pending-deletion/'
  // const deletionLocation = 'bray/resources/'

  // const files = await listAppliedResources(OWNER, REPO, RESOURCELOCATION)
  // console.log(files);

  // await moveFilesInDirectory(repo, resourceLocation, deletionLocation, files);
  const files = await jsonToCrossplane(resources);



  // Usage
  await commitFiles(OWNER, REPO, BRANCH, files, MESSAGE, PATH);

  // const newFiles = await listFiles(repo, resourceLocation)
  // console.log(newFiles);

  // const diff = files.filter(item => !newFiles.includes(item));
  // console.log(diff);

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