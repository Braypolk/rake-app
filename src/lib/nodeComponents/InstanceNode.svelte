<script lang="ts">
  import NodeTemplate from "./NodeTemplate.svelte";
  import { instanceData } from "./nodeData";
  export let data = instanceData;
</script>

<!-- TODO: when handle connects to subnetwork, update network var in nodeState -->
<NodeTemplate type="Instance" provider="compute" {data}>
  <label for="instance-name">Name</label>
  <input
    id="instance-name"
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

  <!-- TODO: replace this with the value of a subnetwork connected with an edge -->
  <label for="subnetwork">Subnetwork</label>
  <input
    id="subnetwork"
    class="nodrag"
    on:input={(evt) => {
      data.subnetwork = evt.target?.value;
    }}
    value={data.subnetwork}
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
      data.zone = evt.target?.value;
    }}
    value={data.zone}
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
      data.machineType = evt.target?.value;
    }}
    value={data.machineType}
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
      data.bootDisk = evt.target?.value;
    }}
    value={data.bootDisk}
    on:keydown={(evt) => {
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.stopPropagation();
      }
    }}
  />
</NodeTemplate>
