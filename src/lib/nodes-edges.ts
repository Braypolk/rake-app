import { writable, type Writable, get } from "svelte/store";
import type { Node, Edge, XYPosition } from "@xyflow/svelte";

const id = writable('');

const nodes: Writable<Node[]> = writable<Node[]>([]);
const edges = writable<Edge[]>([]);

// Define sorting rules based on the node type
const sortOrder = {
  'Project': 1,
  'Network': 2,
  'Subnetwork': 3,
  'Instance': 4,
  'Bucket': 5,
  'Firewall': 99,
  'InstanceGroup': 99,
  'Router': 99,
// END OF SORT ORDER
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

function incrementid() {
  id.update(() => Math.random().toString(16).slice(2).toString());
  return get(id);
}

function findNode(id: string) {
  return get(nodes).findIndex(n => n.id === id)
}

function newNode(data: Object, pos: XYPosition, type: string) {
  addNodes([{
    id: incrementid(),
    type: type,
    data: data,
    position: pos,
    parentNode: "",
    // class: "bg-gray-200",
    // set the origin of the new node so it is centered
    // origin: [0.5, 0.5],
  }]);
}

export { nodes, edges, id, incrementid, addNodes, findNode, sortNodes, newNode };
