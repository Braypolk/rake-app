<script lang="ts" context="module">
  import type{ Node } from "@xyflow/svelte";
  import { nodes, getId } from "$lib/nodes-edges";
  import { get } from 'svelte/store';

  export function onDragOver(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }

  export function onDrop(event: DragEvent, pos: { x: number; y: number;}): Node[] | null {   
    event.preventDefault();

    if (!event.dataTransfer) {
      return null;
    }

    const type = event.dataTransfer.getData("application/svelteflow");
    let newId = getId();

    const newNode: Node = {
      id: `${newId}`,
      type,
      data: { label: `Node ${newId}` },
      // project the screen coordinates to pane coordinates
      position: pos,
      // set the origin of the new node so it is centered
      origin: [0.5, 0.5],
    };

    get(nodes).push(newNode);
    return get(nodes);
  }
</script>
