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

export const nodeTypeToDataMap = {
    Project: projectData,
    Network: networkData,
    Subnetwork: subnetworkData,
    Instance: instanceData,
    Bucket: bucketData,
  };