import { writable, type Writable, get } from "svelte/store";
import type { Node, Edge } from "@xyflow/svelte";

const nodeId = writable('');

const nodes: Writable<Node[]> = writable<Node[]>([]);
const edges = writable<Edge[]>([]);

// Define sorting rules based on the node type
const sortOrder = {
  'Project': 1,
  'Network': 2,
  'Subnetwork': 3,
  'Instance': 4,
  'Bucket': 5
  //...
};

function addNodes(newNodes: Node[]) {
  nodes.update(currentNodes => {
    // Combine the existing nodes with the new ones
    const allNodes = [...currentNodes, ...newNodes];

    // Sort all nodes based on the sortOrder
    allNodes.sort((a, b) => sortOrder[a.type] - sortOrder[b.type]);

    return allNodes;
  });
}

function sortNodes() {
  nodes.update(currentNodes => {
    // Sort all nodes based on the sortOrder
    currentNodes.sort((a, b) => sortOrder[a.type] - sortOrder[b.type]);
    return currentNodes;
  });
}

function incrementNodeId() {
  nodeId.update(() => Math.random().toString(16).slice(2).toString());
  return get(nodeId);
}

function findNode(id: string) {
  return get(nodes).findIndex(n => n.id === id)
}

export { nodes, edges, nodeId, incrementNodeId, addNodes, findNode, sortNodes };
