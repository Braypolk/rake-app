<script lang="ts">
  import NodeTemplate from "./NodeTemplate.svelte";
  import { networkData } from "./nodeData";
  export let data = networkData;
</script>

<NodeTemplate type="Network" provider="compute" {data}>
  <label for="network-name">Name</label>
  <input
    id="network-name"
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

  <label for="description">Description</label>
  <input
    id="description"
    class="nodrag"
    on:input={(evt) => {
      data.description = evt.target?.value;
    }}
    value={data.description}
    on:keydown={(evt) => {
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.stopPropagation();
      }
    }}
  />

  <label for="routingMode">Routing Mode:</label>
  <select
    id="routingMode"
    value={data.routingMode}
    on:change={(evt) => {
      data.routingMode = evt.target?.value;
    }}
  >
    <option>REGIONAL</option>
    <option>GLOBAL</option>
  </select>
</NodeTemplate>
