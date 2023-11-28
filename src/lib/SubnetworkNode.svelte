<script lang="ts">
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";
  import { onMount, onDestroy } from "svelte";

  type $$Props = NodeProps;

  export let data = {
    name: "",
    ipCidrRange: "",
    region: "us-central1",
    status: "unsynced",
    network: Number,
  };

  let intervalId: any;
  onMount(() => {
    intervalId = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/apis/compute.gcp.upbound.io/v1beta1/subnetworks/${data.name}/status`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const status = await response.json();
        if (status.status) {
          console.log(
            status.status.conditions[0].reason,
            status.status.conditions[0].status
          );
          if (status.status.conditions[0].status) {
            console.log("it done did sync");
            data.status = "synced";
          }
        } else {
          console.log("waiting...");
        }
      } catch (error) {
        console.error("Failed to fetch subnetwork status:", error);
      }
    }, 5 * 1000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<!-- TODO: subnetwork should live in network group and thus automatically know the network it should be attatched to -->
<div class="subnetwork">
  <h1 class="text-lg">Subnetwork</h1>
  {#if data.status == "unsynced"}
    <div class="unsynced">Unsynced</div>
  {:else if data.status == "syncing"}
    <div class="syncing">Syncing...</div>
  {:else if data.status == "synced"}
    <div class="synced">Synced</div>
  {/if}
  <Handle type="target" position={Position.Left} />
  <label for="subnetwork-name">Name</label>
  <input
    id="subnetwork-name"
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

  <label for="network">Network</label>
  <input
    id="network"
    class="nodrag"
    type="number"
    on:input={(evt) => {
      console.log(evt.target?.value);
      data.network = evt.target?.value;
    }}
    value={data.network}
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
      data.ipCidrRange = evt.target?.value;
    }}
    value={data.ipCidrRange}
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
      data.location = evt.target?.value;
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

  <Handle
    type="source"
    position={Position.Right}
    on:connect
    on:connectend
    on:connectstart
  />
</div>

<style>
  .subnetwork {
    padding: 1rem;
    background: #eee;
    border-radius: 0.125rem;
    font-size: 0.7rem;
  }
</style>
