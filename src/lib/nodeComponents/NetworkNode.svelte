<script lang="ts">
  import NodeTemplate from "./NodeTemplate.svelte";
  import { nodeData } from "$lib/nodes-edges";
  export let id: string;
  $$restProps;
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
  <select
    id="routingMode"
    value={$nodeData[id].routingMode}
    on:change={(evt) => {
      $nodeData[id].routingMode = evt.target?.value;
    }}
  >
    <option>REGIONAL</option>
    <option>GLOBAL</option>
  </select>
</NodeTemplate>

<style>
  :global(.svelte-flow__node-Network) {
    background-color: rgba(131, 131, 131, 0.539);
    border: 3px solid rgb(200, 200, 200);
    border-radius: 1rem;
  }
</style>
