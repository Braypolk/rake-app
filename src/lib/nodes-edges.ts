import { writable } from "svelte/store";
import type { Node, Edge } from '@xyflow/svelte';

const nodeId = writable(-1);

const nodes = writable<Node[]>([]);
const edges = writable<Edge[]>([]);

function incrementNodeId() {
  nodeId.update((value) => value + 1);
}

export { nodes, edges, nodeId, incrementNodeId };