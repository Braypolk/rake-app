
export function jsonToCrossplane(resources) {
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
                        'namespace': 'dev',
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
                        'namespace': 'dev',
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
                    },
                }
                break;
            case 'Subnetwork':
                resource = {
                    'apiVersion': 'compute.gcp.upbound.io/v1beta1',
                    'kind': 'Subnetwork',
                    'metadata': {
                        'name': item['data']['name'],
                        'namespace': 'dev',
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
                    },
                }
                break;
            case "Instance":
                resource = {
                    'apiVersion': 'compute.gcp.upbound.io/v1beta1',
                    'kind': 'Instance',
                    'metadata': {
                        'name': item['data']['name'],
                        'namespace': 'dev',
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