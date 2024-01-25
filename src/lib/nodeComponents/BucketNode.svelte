<script lang="ts">
  import NodeTemplate from "./NodeTemplate.svelte";
  import { bucketData } from "./nodeData";
  export let data = bucketData;
</script>

<NodeTemplate type="Bucket" provider="storage" id={data.id}>
  <label for="bucket-name">Name</label>
  <input
    id="bucket-name"
    class="nodrag"
    on:input={(evt) => {
      data.name = evt.target?.value;
    }}
    value={data.name}
    on:keydown={(evt) => {
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.stopPropagation();
      }
    }}
  />

  <label for="location">Location:</label>
  <select
    id="location"
    on:change={(evt) => {
      data.location = evt.target?.value;
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
        data.publicState = evt.target?.checked;
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
