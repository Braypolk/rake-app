<script lang="ts">
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";
  import { onMount, onDestroy } from "svelte";

  type $$Props = NodeProps;

  export let data = {
    name: "",
    description: "",
    routingMode: "REGIONAL",
    status: "unsynced",
  };

  let intervalId: any;
  onMount(() => {
    intervalId = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/apis/compute.gcp.upbound.io/v1beta1/networks/${data.name}/status`
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
        console.error("Failed to fetch network status:", error);
      }
    }, 5 * 1000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<div class="network node">
  <h1 class="text-lg">Network</h1>
  {#if data.status == "unsynced"}
    <div class="unsynced">Unsynced</div>
  {:else if data.status == "syncing"}
    <div class="syncing">Syncing...</div>
  {:else if data.status == "synced"}
    <div class="synced">Synced</div>
  {/if}
  <Handle type="target" position={Position.Left} />

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

  <div
    class="absolute right-0 w-5 h-5 bg-red-500 hover:cursor-move"
    use:dragAction
  />

  <Handle
    type="source"
    position={Position.Right}
    on:connect
    on:connectend
    on:connectstart
  />
</div>
