<script lang="ts">
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";
  import { onMount, onDestroy } from "svelte";

  type $$Props = NodeProps;

  export let data = {
    name: String,
    machineType: String,
    bootDisk: String,
    zone: String, // TODO: zone should be auto populated from subnetwork
    subnetwork: Number,
    status: String,
  };

  let intervalId: any;
  onMount(() => {
    intervalId = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/apis/compute.gcp.upbound.io/v1beta1/instances/${data.name}/status`
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
        console.error("Failed to fetch instance status:", error);
      }
    }, 5 * 1000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<!-- TODO: when handle connects to subnetwork, update network var in nodeState -->
<div class="instance node">
  <h1 class="text-lg">Instance</h1>
  {#if data.status == "unsynced"}
    <div class="unsynced">Unsynced</div>
  {:else if data.status == "syncing"}
    <div class="syncing">Syncing...</div>
  {:else if data.status == "synced"}
    <div class="synced">Synced</div>
  {/if}
  <Handle type="target" position={Position.Left} />
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

  <label for="subnetwork">Subnetwork</label>
  <input
    id="subnetwork"
    class="nodrag"
    type="number"
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

  <Handle
    type="source"
    position={Position.Right}
    on:connect
    on:connectend
    on:connectstart
  />
</div>
