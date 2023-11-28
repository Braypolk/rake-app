<script lang="ts">
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    useSvelteFlow,
  } from "@xyflow/svelte";
  import Sidebar from "./Sidebar.svelte";
  import { nodes, edges, getId } from "$lib/nodes-edges";
  import NetworkNode from "$lib/NetworkNode.svelte";
  import SubnetworkNode from "$lib/SubnetworkNode.svelte";
  import InstanceNode from "$lib/InstanceNode.svelte";
  import BucketNode from "$lib/BucketNode.svelte";
  import { onDragOver, onDrop } from "./dnd.svelte";
  import "@xyflow/svelte/dist/style.css";

  const { screenToFlowPosition, getIntersectingNodes } = useSvelteFlow();
  const proOptions = { hideAttribution: true };

  const nodeTypes = {
    Bucket: BucketNode,
    Instance: InstanceNode,
    Network: NetworkNode,
    Subnetwork: SubnetworkNode,
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

  function onNodeDrag({ detail: { node } }) {
    const intersections = getIntersectingNodes(node).map((n) => n.id);
    
    $nodes.forEach((n) => {
      n.class = intersections.includes(n.id) ? "highlight" : "bg-gray-200";
    });
    $nodes = $nodes;
  }
</script>

<main>
  <Sidebar />
  <SvelteFlow
    class="text-on-primary-token"
    {nodeTypes}
    {nodes}
    {edges}
    minZoom={0.2}
    maxZoom={4}
    {proOptions}
    on:dragover={onDragOver}
    on:nodedrag={onNodeDrag}
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
