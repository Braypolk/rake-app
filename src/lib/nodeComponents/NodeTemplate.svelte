<script lang="ts">
  import type { NodeProps } from "@xyflow/svelte";
  import { onMount, onDestroy } from "svelte";
  import { findNode, nodes } from "$lib/nodes-edges";

  // TODO: temp until resize is released for svelteflow
  import Moveable from "svelte-moveable";

  type $$Props = NodeProps;

  export let data: $$Props["data"];

  // var for moveable
  let targetRef = null;

  //  when setting type it should be singular
  export let type = "";
  $: typelower = type.toLowerCase();
  export let provider = "";

  let intervalId: any;
  onMount(() => {
    // check status every 5 seconds
    // TODO: should probably change this so it's not on every component
    intervalId = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:8001/apis/${provider}.gcp.upbound.io/v1beta1/${typelower}s/${data.name}/status`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const status = await response.json();
        if (status.status) {
          console.log(
            status.status.conditions[0].reason,
            status.status.conditions[0].status,
          );
          if (status.status.conditions[0].status) {
            data.status = "synced";
          }
        } else {
          data.status = "syncing";
          console.log("waiting...");
        }
      } catch (error) {
        console.error("Failed to fetch network status:", error);
        if (data.status != "deployed") {
          data.status = "unsynced";
        }
      }
    }, 50 * 1000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<!-- bind and height in style are for moveable and should be deleted once resize is released -->
<div
  class={`${typelower} node`}
  bind:this={targetRef}
  style={`height: inherit;`}
>
  <h1 class="text-lg">{type}</h1>
  {#if data.status == "unsynced"}
    <div class="unsynced">Unsynced</div>
  {:else if data.status == "deployed"}
    <div class="syncing">Deployed...</div>
  {:else if data.status == "syncing"}
    <div class="syncing">Syncing...</div>
  {:else if data.status == "synced"}
    <div class="synced">Synced</div>
  {/if}
  <slot />
</div>

<!-- remove once resize is released -->
<Moveable
  target={targetRef}
  resizable={true}
  keepRatio={false}
  origin={false}
  throttleResize={1}
  renderDirections={["se"]}
  on:resize={({ detail: e }) => {
    $nodes[findNode(e.target.parentNode.getAttribute("data-id"))].style =
      `width: ${e.target.style.width}; height: ${e.target.style.height};`;

    e.target.style.width = `${e.width}px`;
    e.target.style.height = `${e.height}px`;
    e.target.style.transform = e.drag.transform;
  }}
/>
