import { writable, type Writable, get } from "svelte/store";
import type { Node, Edge, XYPosition } from "@xyflow/svelte";

let id = '';

export const renderedNodes: Writable<Node[]> = writable<Node[]>([]);
export const renderedNodeData: Writable<{ [id: string]: any }> = writable<{ [id: string]: any }>({});

export const nodes: Writable<Node[]> = writable<Node[]>([]);
export const nodeData: Writable<{ [id: string]: any }> = writable<{ [id: string]: any }>({});

export const edges: Writable<Edge[]> = writable<Edge[]>([]);

export const leftSidebarSize: Writable<number> = writable<number>(10);
export const paneSize: Writable<number> = writable<number>(0);

// contains the data for each node with a key of id

// todo: also need to do edges

export const showContent: Writable<boolean> = writable<boolean>(true);

// used because the DnD api is annoying and doesn't show data when dragging, only when dropped.
export const draggingNodeType: Writable<string> = writable<string>('');

// Define sorting rules based on the node type
const sortOrder = {
  'For': 99,
  'Project': 1,
  'Network': 2,
  'Subnetwork': 3,
  'Instance': 4,
  'Bucket': 5,
  'Firewall': 99,
  'InstanceGroup': 99,
  'Router': 99,
  'BackendService': 99,
  // END OF SORT ORDER
};

// export function sortNodes() {
//   // assignChildren();

// nodes.update(currentNodes => {
//   // Sort all nodes based on the sortOrder
//   currentNodes.sort((a, b) => sortOrder[a.type] - sortOrder[b.type]);
//   return currentNodes;
// });
// }

// recursively find the children of a node given its id
export function findChildren(passedNodes: Node[], parentId: string) {
  let children: { [key: string]: string } = {};

  // Helper function to recursively find children with type annotation for parameter
  const findChildNodes = (id: string) => {
    passedNodes.forEach((node: Node) => {
      if (node.parentNode === id) {
        children[node.id] = node.parentNode; // Store the node ID as the value, or change to another string property
        findChildNodes(node.id); // Recursively find children
      }
    });
  };

  findChildNodes(parentId);
  return children;
}

export function sortNodes(passedNodes: Writable<Node[]>, passedNodeData: Writable<{ [id: string]: any; }>) {
  let definedNodes = get(passedNodes);
  let definedNodeData = get(passedNodeData);

  // Create a map to store the nodes by their ID for quick access
  const nodeMap = new Map<string, any>();
  definedNodes.forEach(node => nodeMap.set(node.id, node));

  // Helper function to recursively add nodes to the sorted array
  function addWithChildren(nodeId: string, sortedNodes: any[], visited: Set<string>, helperPassedNodeData: { [id: string]: any; }) {
    if (visited.has(nodeId)) {
      return; // Avoid cycles in the hierarchy
    }
    visited.add(nodeId);

    const node = nodeMap.get(nodeId);
    if (node) {
      // Add the current node
      sortedNodes.push(node);
      // Add all children recursively, ensuring we check if children exists
      const children = helperPassedNodeData[nodeId] && helperPassedNodeData[nodeId].children ? helperPassedNodeData[nodeId].children : [];
      children.forEach((childId: string) => addWithChildren(childId, sortedNodes, visited, helperPassedNodeData));
    }
  }

  // Array to hold the sorted nodes
  const sortedNodes: any[] = [];
  // Set to keep track of visited nodes to avoid cycles
  const visited = new Set<string>();

  // Start with nodes that have no parent (top-level nodes)
  definedNodes.forEach(node => {
    if (!node.parentNode) {
      addWithChildren(node.id, sortedNodes, visited, definedNodeData);
    }
  });

  passedNodes.set(sortedNodes);
}

export function generateNewId() {
  return Math.random().toString(16).slice(2).toString();
}

export function findNode(id: string, passedNodes: Writable<Node[]> = nodes): number {
  return get(passedNodes).findIndex(n => n.id === id)
}

export function newNode(passedNodes: Writable<Node[]>, passedNodeData: Writable<{ [id: string]: any; }>, data: Object, pos: XYPosition, type: string, parentNodeId: string = "", style: string = "", selected: boolean = false): Node {
  const newId = generateNewId();
  const createdNode: Node = {
    id: newId,
    type: type,
    data: {},
    position: pos,
    parentNode: parentNodeId,
    class: type,
    style: style,
    selected: selected,
    // set the origin of the new node so it is centered
    // origin: [0.5, 0.5],
  };

  passedNodes.update((currentNodes) => {
    return [...currentNodes, createdNode]
  });

  data.children = [];

  passedNodeData.update((currentData: { [id: string]: {} }) => {
    currentData[newId] = { ...data, status: "unsynced" };
    if (parentNodeId !== "") {
      currentData[parentNodeId].children.push(newId);
    }
    return currentData;
  });
  sortNodes(passedNodes, passedNodeData);
  return createdNode;
}

// look: inefficient, could probably be done better. Reassign all children after any node relationship is modified
export function assignChildren(passedNodes: Writable<Node[]>, passedNodeData: Writable<{ [id: string]: any; }>) {
  const definedNodes = get(passedNodes);
  const definedNodeData = get(passedNodeData);

  // Loop through each defined node
  for (let i = 0; i < definedNodes.length; i++) {
    const nodeId = definedNodes[i].id;
    // Check if the current node has children
    if (definedNodeData[nodeId].children) {
      // Reset the children array for the current node
      definedNodeData[nodeId].children = [];
      // Loop through each defined node again to find children of the current node
      for (let q = 0; q < definedNodes.length; q++) {
        // If the current node is the parent of the iterated node, add it to the children array
        if (definedNodes[q].parentNode === nodeId) {
          definedNodeData[nodeId].children.push(definedNodes[q].id);
        }
      }
    }
  }
  passedNodeData.set(definedNodeData);
}