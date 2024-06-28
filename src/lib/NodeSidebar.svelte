<script lang="ts">
  import { nodes, nodeData } from "$lib/nodes-edges";

  // todo: this is duplicate code from flow.svelte. Done to make the render nodes button work correctly
  $: selectedNodeIds = $nodes
    .filter((node) => node.selected)
    .map((node) => node.id);
</script>

<div>
  {#if selectedNodeIds.length == 1 && selectedNodeIds[0] != undefined}
    {#each Object.entries($nodeData[selectedNodeIds[0]]) as [key, value]}
      {#if key != "children"}
        <div>
          <label for={key}>{key}</label>
          <input
            id={key}
            type="text"
            style="color: black;"
            bind:value={$nodeData[selectedNodeIds[0]][key]}
            on:keydown={(evt) => {
              if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
              }
            }}
          />
        </div>
      {/if}
    {/each}
  {/if}
</div>
