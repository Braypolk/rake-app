<script lang="ts">
  import NodeTemplate from "./NodeTemplate.svelte";
  import { nodeData, variables } from "$lib/nodes-edges";
  import Fuse from "$lib/fuse.svelte";
  export let id: string;
  $$restProps;

  let varIndex: number = 0;
  $: test = $variables.filter((v) => v.type === "number");

  $: {
    $nodeData[id].var = test[varIndex].name;
    $nodeData = $nodeData;
  }
</script>

<NodeTemplate type="For" provider="compute" {id}>
  <div class="flex flex-wrap">
    <Fuse searchList={test} />
    <div class="property">
      <span class="property-var">var</span>
      <span
        class="info-icon"
        title="an whole number specifying how many times to loop over everything inside"
        >ℹ</span
      >

      <select id="varTypeSelection" bind:value={$nodeData[id].varType}>
        <option value={true}>Variable</option>
        <option value={false}>Number</option>
      </select>

      {#if $nodeData[id].varType}
        <select bind:value={varIndex}>
          {#each test as { name, type }, index}
            <!-- {#if type === "number"} -->
            <option value={index}>{name}</option>
            <!-- {/if} -->
          {/each}
        </select>
        <span>({test[varIndex].value})</span>
      {:else}
        <input
          class="nodrag"
          type="number"
          min="1"
          bind:value={$nodeData[id].num}
        />
      {/if}
    </div>
  </div>
</NodeTemplate>

<style>
  :global(.svelte-flow__node-For) {
    width: 400px;
    height: 200px;
    background-color: rgba(131, 131, 131, 0.539);
    border: 3px solid rgb(200, 200, 200);
    border-radius: 1rem;
  }
  .info-icon {
    /* Your CSS styles */
    cursor: help; /* Change the cursor to indicate hoverable */
  }
</style>
