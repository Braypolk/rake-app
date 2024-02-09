<script lang="ts">
  import NodeTemplate from "./NodeTemplate.svelte";
  import CustomHandle from "./CustomHandle.svelte";
  import { nodeData } from "$lib/nodes-edges";
  export let id: string;
</script>

<CustomHandle type="target" />
<NodeTemplate type="Instance" provider="compute" {id}>
  <label for="instance-name">Name</label>
  <input
    id="instance-name"
    class="nodrag"
    on:input={(evt) => {
      $nodeData[id].name = evt.target?.value;
    }}
    value={$nodeData[id].name}
    on:keydown={(evt) => {
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.stopPropagation();
      }
    }}
  />

  <!-- Todo: this should be a drop down and should be pulled from gcp and  subnet/network -->
  <label for="zone">Zone</label>
  <input
    id="zone"
    class="nodrag"
    on:input={(evt) => {
      $nodeData[id].zone = evt.target?.value;
    }}
    value={$nodeData[id].zone}
    on:keydown={(evt) => {
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.stopPropagation();
      }
    }}
  />

  <!-- Todo: this should be a drop down and should be pulled from gcp -->
  <label for="machineType">Machine Type</label>
  <input
    id="machineType"
    class="nodrag"
    on:input={(evt) => {
      $nodeData[id].machineType = evt.target?.value;
    }}
    value={$nodeData[id].machineType}
    on:keydown={(evt) => {
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.stopPropagation();
      }
    }}
  />

  <!-- Todo: this should be a drop down and should be pulled from gcp -->
  <label for="bootDisk">Boot Disk</label>
  <input
    id="bootDisk"
    class="nodrag"
    on:input={(evt) => {
      $nodeData[id].bootDisk = evt.target?.value;
    }}
    value={$nodeData[id].bootDisk}
    on:keydown={(evt) => {
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.stopPropagation();
      }
    }}
  />
</NodeTemplate>
<CustomHandle type="source" />


