<script lang="ts">
  import NodeTemplate from "./NodeTemplate.svelte";
  import { nodeData } from "$lib/nodes-edges";
  export let id: string;
  $$restProps;
</script>

<NodeTemplate type="Bucket" provider="storage" {id}>
  <label for="bucket-name">Name</label>
  <input
    id="bucket-name"
    class="nodrag"
    on:input={(evt) => {
      $nodeData[id].name = evt.target?.value;
    }}
    value={$nodeData[id].name}
  />

  <label for="location">Location:</label>
  <select
    id="location"
    on:change={(evt) => {
      $nodeData[id].location = evt.target?.value;
    }}
  >
    <option>US</option>
    <option>EU</option>
  </select>

  <div style="display: block;">
    <input
      id="publicState"
      type="checkbox"
      name="publicState"
      on:change={(evt) => {
        $nodeData[id].publicState = evt.target?.checked;
      }}
    />Public
  </div>
</NodeTemplate>

<style>
  :global(.svelte-flow__node-Bucket) {
    background-color: rgba(184, 234, 234, 0.88);
    border: 3px solid rgb(160, 160, 160);
    border-radius: 1rem;
  }
</style>
