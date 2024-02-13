import { writable, type Writable, get } from "svelte/store";
import type { Node, Edge, XYPosition } from "@xyflow/svelte";

const id = writable('');

const nodes: Writable<Node[]> = writable<Node[]>([]);
const edges: Writable<Edge[]> = writable<Edge[]>([]);
const leftSidebarSize: Writable<number> = writable<number>(10);
const paneSize: Writable<number> = writable<number>(20);

// contains the data for each node with a key of id
const nodeData: Writable<{ [id: string]: any }> = writable<{ [id: string]: any }>({});
// keeps track of the array position of each node with format { id(string): arrayPosition (number) }
const nodeArrayPosition: Writable<Object> = writable<Object>({});

// todo: also need to do edges

const drawerOpen: Writable<boolean> = writable<boolean>(false);
const showContent: Writable<boolean> = writable<boolean>(true);

// used because the DnD api is annoying and doesn't show data when dragging, only when dropped.
const draggingNodeType: Writable<string> = writable<string>('');

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
  'BackendService': 99,
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

function findNode(id: string): number {
  return get(nodes).findIndex(n => n.id === id)
}

function newNode(data: Object, pos: XYPosition, type: string, parentNodeId: string = "", style: string = "", selected: boolean = false): Node {
  const newId = incrementid();
  const node = {
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
  addNodes([node]);

  nodeData.update((currentData: { [id: string]: {} }) => {
    currentData[newId] = {... data, status: "unsynced"};
    return currentData;
  });

  return node;
}

export { nodes, nodeData, nodeArrayPosition, edges, leftSidebarSize, paneSize, draggingNodeType, drawerOpen, showContent, id, incrementid, addNodes, findNode, sortNodes, newNode };
