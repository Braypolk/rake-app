<script lang="ts">
  import { writable } from "svelte/store";
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    useSvelteFlow,
    type Node,
    type Edge,
  } from "@xyflow/svelte";
  import Sidebar from "./Sidebar.svelte";
  import { nodes, edges, getId } from "$lib/nodes-edges";
  import BucketNode from "$lib/BucketNode.svelte";
  import { onDragOver, onDrop } from "./dnd.svelte";
  import "@xyflow/svelte/dist/style.css";

  const { screenToFlowPosition, getIntersectingNodes, toObject, setViewport } =
    useSvelteFlow();
  const panOnDrag = [1, 2];
  const proOptions = { hideAttribution: true };

  const nodeTypes = {
    Bucket: BucketNode,
  };

  function handleDrop(e: DragEvent) {
    const temp = onDrop(
      e,
      screenToFlowPosition({ x: e.clientX, y: e.clientY })
    );
    if (temp) {
      $nodes = temp;
    }
  }

  async function onSave() {
  const flow = toObject();
  console.log(flow);
  
  try {
    const response = await fetch('/api/flow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({flow: flow, location: '/Users/braypolkinghorne/Documents/code/Rake/rake-app/src/lib/test.json'})  //todo: will have to be changed when not using local storage
    });

    if (response.ok) {
      console.log('Flow saved successfully');
    } else {
      console.error('Failed to save flow');
    }
  } catch (error) {
    console.error('Error saving flow:', error);
  }
}

async function onRestore() {
  try {
    //todo: will have to be changed when not using local storage
    const response = await fetch('/api/flow?location=/Users/braypolkinghorne/Documents/code/Rake/rake-app/src/lib/test.json');
    
    if (response.ok) {
      console.log('Flow restored successfully');
      const res = await response.json();
      const { flow, message } = res.body;
      console.log(flow, message);
      

      if (flow) {
        const { x = 0, y = 0, zoom = 1, nodes, edges } = flow;
        $nodes = nodes;
        $edges = edges;
        setViewport({ x, y, zoom });
        console.log(message);
      } else {
        console.log(message);
      }
    } else {
      console.error('Failed to restore flow');
    }
  } catch (error) {
    console.error('Error restoring flow:', error);
  }
}
</script>

<main>
  <button on:click={onSave}>Save</button>
  <button on:click={onRestore}>Restore</button>
  <Sidebar />
  <SvelteFlow
    class="text-on-primary-token"
    {nodeTypes}
    {nodes}
    {edges}
    fitView
    {proOptions}
    on:dragover={onDragOver}
    on:drop={(e) => {
      handleDrop(e);
    }}
  >
    <Background bgColor="#0f161d" variant={BackgroundVariant.Cross} />
    <Controls />
    <!-- <MiniMap /> -->
  </SvelteFlow>
</main>

<style>
  main {
    padding: 0;
    margin: 0;
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
