<script lang="ts">
  import type { Writable } from "svelte/store";
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";
    import { onMount, onDestroy } from "svelte";

  type $$Props = NodeProps;

  export let data = { location: 'US', name: 'test', publicState: false, status: 'unsynced' };
  // const { location, name, publicState, status } = data;

  let intervalId: any;
  onMount(() => {
    intervalId = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8001/apis/storage.gcp.upbound.io/v1beta1/buckets/${data.name}/status`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const status = await response.json();
        if(status.status) {
          console.log(status.status.conditions[0].reason, status.status.conditions[0].status);          
          if(status.status.conditions[0].status){
            console.log('it done did sync');
            data.status = 'synced';
          }
          
        }
        else {
          console.log('waiting...');
        }
      } catch (error) {
        console.error('Failed to fetch bucket status:', error);
      }
    }, 5 * (1000));
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<div class="bucket">
  {#if data.status == 'unsynced'}
    <div class="unsynced">Unsynced</div>
  {:else if data.status == 'syncing'}
    <div class="syncing">Syncing...</div>
  {:else if data.status == 'synced'}
    <div class="synced">Synced</div>
  {/if}
  <Handle type="target" position={Position.Left} />
  <label for="bucket-name">Name</label>
  <input
    id="bucket-name"
    class="nodrag"
    on:input={(evt) => {
      data.name = evt.target?.value;
    }}
    value={data.name}
    on:keydown={(evt) => {
      if (evt.key === 'Delete' || evt.key === 'Backspace') {
        evt.stopPropagation();
      }
    }}
  />
  <label for="location">Location:</label>
  <select
    id="location"
    on:change={(evt) => {
      data.location = evt.target?.value;
    }}
  >
    <option>US</option>
    <option>EU</option>
  </select>
  <div style="display: block;">
    <input
      id="publicState"
      type="checkbox"
      name="publicState"
      on:change={(evt) => {
        data.publicState = evt.target?.checked;
      }}
    />Public
  </div>
  <Handle
    type="source"
    position={Position.Right}
    on:connect
    on:connectend
    on:connectstart
  />
</div>

<style>
  .bucket {
    padding: 1rem;
    background: #eee;
    border-radius: 0.125rem;
    font-size: 0.7rem;
  }
</style>
