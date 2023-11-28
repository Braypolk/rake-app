import { writable } from "svelte/store";
import type { Node, Edge } from '@xyflow/svelte';

let id = 0;
const getId = () => {
  id = id + 1;
  return id;
};

// TODO: eventually want this to be empty
const nodes = writable<Node[]>([
  {
    id: `${id}`,
    type: 'group',
    data: {},
    position: { x: 0, y: 0 },
    style: 'width: 270px; height: 440px; resize: both; overflow: auto;'
  }
]);

const edges = writable([]);

export { nodes, edges, getId };