<script lang="ts">
  import type { Writable } from "svelte/store";
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";

  type $$Props = NodeProps;

  export let data: { location: Writable<string>; name: Writable<string> };
</script>

<div class="bucket">
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
      id="public"
      type="checkbox"
      name="public"
      on:change={(evt) => {
        data.public = evt.target?.checked;
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
