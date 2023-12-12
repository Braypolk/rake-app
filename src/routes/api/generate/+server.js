// @ts-nocheck
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
      resourceList.push({ file: item['type'] + '-' + item['data']['name'] + '.yaml', content: resource });
    }
  });
  return resourceList;
}


export async function POST({ request }) {
  let resources = await request.json();

  resources.forEach(resource => {
    console.log('resources', resource.type + '-' + resource.data.name);
  });

  const OWNER = 'bray-rake';
  const REPO = 'rake-resources';
  const BRANCH = 'main';
  const MESSAGE = 'commit test';
  const PATH = 'bray/resources/';

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