<script lang="ts">
  import NodeTemplate from "./NodeTemplate.svelte";
  import CustomHandle from "./CustomHandle.svelte";
  import { nodeData } from "$lib/nodes-edges";
  export let id: string;
  $$restProps;
</script>

<CustomHandle type="target" />
<NodeTemplate type="Subnetwork" provider="compute" {id}>
  <label for="subnetwork-name">Name</label>
  <input
    id="subnetwork-name"
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

  <label for="ipCidrRange">IP Cidr Range</label>
  <input
    id="ipCidrRange"
    class="nodrag"
    on:input={(evt) => {
      $nodeData[id].ipCidrRange = evt.target?.value;
    }}
    value={$nodeData[id].ipCidrRange}
    on:keydown={(evt) => {
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.stopPropagation();
      }
    }}
  />

  <label for="region">Region</label>
  <select
    id="region"
    class="nodrag"
    on:change={(evt) => {
      $nodeData[id].location = evt.target?.value;
    }}
  >
    <option>us-central1</option>
    <option>asia-east1</option>
    <option>asia-east2</option>
    <option>asia-northeast1</option>
    <option>asia-northeast2</option>
    <option>asia-northeast3</option>
    <option>asia-south1</option>
    <option>asia-south2</option>
    <option>asia-southeast1</option>
    <option>asia-southeast2</option>
    <option>australia-southeast1</option>
    <option>australia-southeast2</option>
    <option>europe-central2</option>
    <option>europe-north1</option>
    <option>europe-southwest1</option>
    <option>europe-west1</option>
    <option>europe-west10</option>
    <option>europe-west12</option>
    <option>europe-west2</option>
    <option>europe-west3</option>
    <option>europe-west4</option>
    <option>europe-west6</option>
    <option>europe-west8</option>
    <option>europe-west9</option>
    <option>me-central1</option>
    <option>me-central2</option>
    <option>me-west1</option>
    <option>northamerica-northeast1</option>
    <option>northamerica-northeast2</option>
    <option>southamerica-east1</option>
    <option>southamerica-west1</option>
    <option>us-central1</option>
    <option>us-east1</option>
    <option>us-east4</option>
    <option>us-east5</option>
    <option>us-south1</option>
    <option>us-west1</option>
    <option>us-west2</option>
    <option>us-west3</option>
    <option>us-west4</option>
  </select>
</NodeTemplate>
<CustomHandle type="source" />

<style>
  :global(.svelte-flow__node-Subnetwork) {
    background-color: rgba(131, 131, 131, 0.539);
    border: 3px solid rgb(255, 255, 255);
    border-radius: 1rem;
  }
</style>
