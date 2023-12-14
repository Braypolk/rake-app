<script lang="ts">
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    useSvelteFlow,
  } from "@xyflow/svelte";
  import Sidebar from "./Sidebar.svelte";
  import { nodes, edges, findNode, newNode } from "$lib/nodes-edges";
  import { nodeTypeToDataMap } from "$lib/nodeComponents/nodeData";
  import { nodeTypes } from "$lib/nodeComponents/nodeComponents";
  import "@xyflow/svelte/dist/style.css";

  const { screenToFlowPosition, getIntersectingNodes } = useSvelteFlow();

  function onDragOver(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }

  // TODO: not sure how to move this to another file because it can't be a svelte file because idk how to export a function, it can't be a ts file because it uses useSvelteFlow which requires a svelte file or more specifically to be a child of a svelteflow instance
  function onDrop(event: DragEvent): void {
    event.preventDefault();
    if (!event.dataTransfer) {
      return;
    }

    const pos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const type = event.dataTransfer.getData("application/svelteflow");
    const data = nodeTypeToDataMap[type];

    if (data) {
      newNode(data, pos, type);
    } else {
      console.log("unknown type");
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

  function onNodeDragStop({ detail: { node, event } }) {
    const nodeId = findNode(node.id)

    if (node.type == "Subnetwork") {
      const intersections = getIntersectingNodes(node)
        .filter((n) => n.type == "Network")
        .map((n) => n.id);

      intersections.forEach((intersection) => {
        $nodes[findNode(node.id)].parentNode = intersection;
      });
      $nodes = $nodes;
      return;
    }

    const intersections = getIntersectingNodes(node)
      .filter((n) => n.id != node.parentNode)
      .map((n) => n.id);

    intersections.forEach((intersection) => {
      // find the type of the intersected node (not the dropped node)
      const type = $nodes[findNode(intersection)].type;
      if (type == "Project") {
        const parentNodeId = findNode(intersection);
        // set the parent of the dropped node to the intersected node if that node is a project
        $nodes[nodeId].parentNode = intersection;
        // minus position of parent so that the position goes to where it is dropped
        $nodes[nodeId].position = { x: $nodes[nodeId].position.x - $nodes[parentNodeId].position.x, y: $nodes[nodeId].position.y - $nodes[parentNodeId].position.y};
      }
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
    proOptions={{ hideAttribution: true }}
    on:dragover={onDragOver}
    on:nodedrag={onNodeDrag}
    on:nodedragstop={onNodeDragStop}
    on:drop={onDrop}
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
