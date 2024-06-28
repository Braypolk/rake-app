import NetworkNode from './NetworkNode.svelte';
import SubnetworkNode from './SubnetworkNode.svelte';
import InstanceNode from './InstanceNode.svelte';
import BucketNode from './BucketNode.svelte';
import ProjectNode from './ProjectNode.svelte';
import FirewallNode from './FirewallNode.svelte';
import InstanceGroupNode from './InstanceGroupNode.svelte';
import RouterNode from './RouterNode.svelte';
import BackendServiceNode from './BackendServiceNode.svelte';
import ForNode from './ForNode.svelte';

export const nodeTypes = {
  Project: ProjectNode,
  Bucket: BucketNode,
  Instance: InstanceNode,
  Network: NetworkNode,
  Subnetwork: SubnetworkNode,
  Firewall: FirewallNode,
  InstanceGroup: InstanceGroupNode,
  Router: RouterNode,
  BackendService: BackendServiceNode,
  For: ForNode,
};