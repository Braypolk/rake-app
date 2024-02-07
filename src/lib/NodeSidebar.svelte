<script lang="ts">
  import { findNode, nodes } from "$lib/nodes-edges";

  $: selectedNodes = $nodes.filter((node) => node.selected);  
</script>

<div>
  {#if selectedNodes.length == 1}
  <input type="text" bind:value={selectedNodes[0].data.folderId} style="color: black;"/>
    <!-- <div style="color: black">
      {selectedNodes[0].data.folderId}
    </div> -->
  {/if}
</div>
