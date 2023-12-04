<script lang="ts">
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    useSvelteFlow,
  } from "@xyflow/svelte";
  import Sidebar from "./Sidebar.svelte";
  import {
    nodes,
    edges,
  } from "/Users/braypolkinghorne/Documents/code/Rake/rake-app/src/lib/nodes-edges";
  import { nodeTypes } from "$lib/nodeComponents/nodeComponents";
  import { onDragOver, onDrop } from "./dnd.svelte";
  import "@xyflow/svelte/dist/style.css";

  const { screenToFlowPosition, getIntersectingNodes } = useSvelteFlow();

  function handleDrop(e: DragEvent) {
    const temp = onDrop(
      e,
      screenToFlowPosition({ x: e.clientX, y: e.clientY }),
    );
    if (temp) {
      $nodes = temp;
    }
  }

  function onNodeDrag({ detail: { node } }) {
    const intersections = getIntersectingNodes(node).map((n) => {
      if (n.id != node.parentNode) {
        return n.id;
      }
    });

    $nodes.forEach((n) => {
      n.class = intersections.includes(n.id) ? "highlight" : "bg-gray-200";
    });
    $nodes = $nodes;
  }

  function onNodeDragStop({ detail: { node } }) {
    const intersections = getIntersectingNodes(node)
      .filter((n) => n.id != node.parentNode)
      .map((n) => n.id);

    intersections.forEach((intersection) => {
      // console.log(parseInt(intersection));
      // console.log($nodes);

      if ("Project" == $nodes[parseInt(intersection)].type) {
        $nodes[node.id].parentNode = intersection;
        // todo: currently jumps on parent change.
        // to fix, change the position to be the mouse position
      }
    });
    // if node rework, need to update all node arrays
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
    proOptions={{ hideAttribution: true }}
    on:dragover={onDragOver}
    on:nodedrag={onNodeDrag}
    on:nodedragstop={onNodeDragStop}
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
