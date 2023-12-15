export let projectData = {
    name: "",
    folderIdRef: "",
    status: "unsynced",
}

export let networkData = {
    name: "",
    description: "",
    routingMode: "REGIONAL",
    status: "unsynced",
}

export let subnetworkData = {
    name: "",
    ipCidrRange: "",
    region: "us-central1",
    status: "unsynced",
}

export let instanceData = {
    name: "",
    subnetwork: "", // TOOD: get subnetwork id from existing networks
    machineType: "e2-medium",
    bootDisk: "debian-cloud/debian-11",
    zone: "us-central1-a", // TODO: zone should be auto populated from subnetwork
    status: "unsynced",
}

export let bucketData = {
    name: "",
    location: "US",
    publicState: false,
    // storageClass: "STANDARD",
    status: "unsynced",
}

export let firewallData = {
    name: "",
    allowed: "",
    denied: "",
    description: "",
    destinationRanges: "",
    direction: "",
    disabled: false,
    logConfig: "",
    network: "",
    networkRef: "",
    networkSelector: "",
    priority: "",
    sourceRanges: "",
    sourceServiceAccounts: "",
    sourceTags: "",
    targetServiceAccounts: "",
    targetTags: "",
};

export let instancegroupData = {
    name: "",
    description: "",
    instances: "",
    namedPort: "",
    network: "",
    networkRef: "",
    networkSelector: "",
    project: "",
    zone: "",
};

export let routerData = {
  name: "",
  bgp: "",
  description: "",
  encryptedInterconnectRouter: false,
  network: "",
  networkRef: "",
  networkSelector: "",
  project: "",
  region: "",
};

export const nodeTypeToDataMap = {
    Project: projectData,
    Network: networkData,
    Subnetwork: subnetworkData,
    Instance: instanceData,
    Bucket: bucketData,
    Firewall: firewallData,
    InstanceGroup: instancegroupData,
    Router: routerData,
};