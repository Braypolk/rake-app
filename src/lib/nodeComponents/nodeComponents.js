import NetworkNode from './NetworkNode.svelte';
import SubnetworkNode from './SubnetworkNode.svelte';
import InstanceNode from './InstanceNode.svelte';
import BucketNode from './BucketNode.svelte';
import ProjectNode from './ProjectNode.svelte';

export const nodeTypes = {
    Project: ProjectNode,
    Bucket: BucketNode,
    Instance: InstanceNode,
    Network: NetworkNode,
    Subnetwork: SubnetworkNode,
  };