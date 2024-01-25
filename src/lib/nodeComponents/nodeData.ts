export let projectData = {
    id: "",
    name: "",
    children: {},
    folderId: "",
    status: "unsynced",
}

export let networkData = {
    id: "",
    name: "",
    children: {},
    description: "",
    routingMode: "REGIONAL",
    status: "unsynced",
}

export let subnetworkData = {
    id: "",
    name: "",
    ipCidrRange: "",
    region: "us-central1",
    status: "unsynced",
}

export let instanceData = {
    id: "",
    name: "",
    subnetwork: "", // TOOD: get subnetwork id from existing networks
    machineType: "e2-medium",
    bootDisk: "debian-cloud/debian-11",
    zone: "us-central1-a", // TODO: zone should be auto populated from subnetwork
    status: "unsynced",
}

export let bucketData = {
    id: "",
    name: "",
    location: "US",
    publicState: false,
    // storageClass: "STANDARD",
    status: "unsynced",
}

export let firewallData = {
    id: "",
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
    id: "",
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
    id: "",
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

export let backendserviceData = {
    id: "",
    name: "",
    affinityCookieTtlSec: "",
    backend: "",
    cdnPolicy: "",
    circuitBreakers: "",
    compressionMode: "",
    connectionDrainingTimeoutSec: "",
    consistentHash: "",
    customRequestHeaders: "",
    customResponseHeaders: "",
    description: "",
    edgeSecurityPolicy: "",
    enableCdn: false,
    healthChecks: "",
    healthChecksRefs: "",
    healthChecksSelector: "",
    iap: "",
    loadBalancingScheme: "",
    localityLbPolicies: "",
    localityLbPolicy: "",
    logConfig: "",
    outlierDetection: "",
    portName: "",
    project: "",
    protocol: "",
    securityPolicy: "",
    securitySettings: "",
    sessionAffinity: "",
    timeoutSec: "",
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
    BackendService: backendserviceData,
};

export const nodeClassToDataMap = {
    project: "project",
    network: "network",
    subnetwork: "subnetwork",
    instance: "instance",
    bucket: "bucket",
    firewall: "firewall",
    instancegroup: "instancegroup",
    router: "router",
    backendservice: "backendservice",
}