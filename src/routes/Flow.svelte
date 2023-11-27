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

  function onSave() {
    console.log(toObject());
    localStorage.setItem("rake-test-flow", JSON.stringify(toObject()));
  }

  async function onRestore() {
    console.log("in restore");
    const flow = JSON.parse(localStorage.getItem("rake-test-flow"));
    console.log(flow);

    if (flow) {
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      $nodes = flow.nodes;
      $edges = flow.edges;
      setViewport({ x, y, zoom });
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
