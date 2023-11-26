import { writable } from "svelte/store";
import type { Node, Edge } from '@xyflow/svelte';

let id = 0;
const getId = () => {
  id = id + 1;
  return id;
};

const nodes = writable<Node[]>([
  {
    id: `${id}`,
    type: 'group',
    data: {},
    position: { x: 0, y: 0 },
    style: 'width: 270px; height: 440px; resize: both; overflow: auto;'
  },
  // {
  //   id: `${getId()}`,
  //   type: 'input',
  //   data: { label: 'child 1' },
  //   position: { x: 20, y: 20 },
  //   parentNode: '0',
  //   extent: 'parent',
  //   style: 'width: 70px; height: 50px;'
  // },
  // {
  //   id: `${getId()}`,
  //   data: { label: 'child 2' },
  //   position: { x: 10, y: 90 },
  //   parentNode: '0',
  //   extent: 'parent',
  //   style: 'width: 70px; height: 50px;'
  // },
  // {
  //   id: `${getId()}`,
  //   data: { label: '3' },
  //   position: { x: 100, y: 250 },
  //   parentNode: '0',
  //   extent: 'parent',
  //   style: 'width: 70px; height: 50px;'
  // },
  {
    id: `${getId()}`,
    // this type needs to match the newly defined node type
    type: 'Bucket',
    position: { x: 0, y: 0 },
    parentNode: '0',
    // data is used to store the current color value
    // data: { name: writable('some-bray-bucket'), location: writable('US'), publicState: writable(false), status: writable('unsynced') },
    data: { name: 'some-bray-bucket', location:'US', publicState: false, status: 'unsynced' },
  }
]);

const edges = writable([
  // {
  //   id: "1-3",
  //   type: "smoothstep",
  //   source: "1",
  //   target: "2",
  // },
]);

export { nodes, edges, getId };