<script lang="ts">
  import NodeTemplate from "./NodeTemplate.svelte";
  import {
    nodeData,
    newNode,
    nodes,
    findNode,
    assignChildren,
  } from "$lib/nodes-edges";
  import { nodeTypeToDataMap } from "./nodeData";
  export let id: string;
  $$restProps;

  let count = 0;

  // look: super jank, should use d3 or something to place nodes in correct spot
  function addSubnet() {
    const type = "Subnetwork";
    let pos = $nodes[findNode(id)].position;

    const createdNode = newNode(
      nodes,
      nodeData,
      { ...nodeTypeToDataMap[type] },
      { x: pos.x, y: pos.y + 100 * count },
      type,
      id,
    );
    assignChildren(nodes, nodeData);
    count += 1;
  }
</script>

<NodeTemplate type="Network" provider="compute" {id}>
  <label for="network-name">Name</label>
  <input
    id="network-name"
    class="nodrag"
    bind:value={$nodeData[id].name}
    on:keydown={(evt) => {
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.stopPropagation();
      }
    }}
  />

  <label for="description">Description</label>
  <input
    id="description"
    class="nodrag"
    on:input={(evt) => {
      $nodeData[id].description = evt.target?.value;
    }}
    value={$nodeData[id].description}
    on:keydown={(evt) => {
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.stopPropagation();
      }
    }}
  />

  <label for="routingMode">Routing Mode:</label>
  <select id="routingMode" bind:value={$nodeData[id].routingMode}>
    <option>REGIONAL</option>
    <option>GLOBAL</option>
  </select>
  <button on:click={addSubnet}>add subnet</button>
</NodeTemplate>

<style>
  :global(.svelte-flow__node-Network) {
    width: 800px;
    height: 300px;
    background-color: rgba(131, 131, 131, 0.539);
    border: 3px solid rgb(200, 200, 200);
    border-radius: 1rem;
  }
</style>
