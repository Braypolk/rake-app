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
  let intersectedRef: Node;

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
    // when I drag I only want to check if the dragged node is intersecting with potential parents (ex: when dragging a network, don't have subnets be "available" intersections)

    // calculate the center point of the node from position and dimensions
    const centerX = node.computed?.positionAbsolute.x + node.computed.width / 2;
    const centerY =
      node.computed?.positionAbsolute.y + node.computed.height / 2;

    // find a node where the center point is inside
    const intersections = $nodes.map((n) => {
      if (
        centerX > n.computed?.positionAbsolute.x &&
        centerX < n.computed?.positionAbsolute.x + n.computed.width &&
        centerY > n.computed?.positionAbsolute.y &&
        centerY < n.computed?.positionAbsolute.y + n.computed.height &&
        n.id !== node.id // this is needed, otherwise we would always find the dragged node
      ) {
        return n;
      }
    });

    if (node.type === "Project") {
      intersectedRef = intersections.findLast((n) => {
        if (n !== undefined) {
          return n.type == "Folder" ? n : null;
        }
      });
    } else if (node.type === "Network") {
      intersectedRef = intersections.findLast((n) => {
        if (n !== undefined) {
          return n.type === "Project" ? n : null;
        }
      });
    } else if (node.type === "Subnetwork") {
      intersectedRef = intersections.findLast((n) => {
        if (n !== undefined) {
          return n.type === "Network" ? n : null;
        }
      });
    }

    $nodes.forEach((n) => (n.class = ""));
    if (intersectedRef && intersectedRef.id !== node.parentNode) {
      intersectedRef.class = "highlight";
    }

    $nodes = $nodes;
  }

  function onNodeDragStop({ detail: { node, event } }) {
    const nodeArrayPosition = findNode(node.id);
    if (intersectedRef) {
      let originalParentPositionAbs = {x: 0, y: 0};
      // assign parent to node
      const parentNodeId = findNode(intersectedRef.id);
      if (
        intersectedRef.type == "Project" ||
        (intersectedRef.type == "Network" && node.type == "Subnetwork")
      ) {
        // if a node has a parent already, remove the node (data.child) from the parent
        if ($nodes[nodeArrayPosition].parentNode !== "") {
          const originalParent =
            $nodes[findNode($nodes[nodeArrayPosition].parentNode)];
          originalParentPositionAbs =
            originalParent.computed?.positionAbsolute;
          delete originalParent.data.children[node.id];
        }
        $nodes[nodeArrayPosition].parentNode = intersectedRef.id;
        $nodes[parentNodeId].data.children[node.id] = nodeArrayPosition;
      }

      $nodes[nodeArrayPosition].position = {
        x: $nodes[nodeArrayPosition].position.x + (originalParentPositionAbs.x - $nodes[parentNodeId].computed.positionAbsolute.x),
        y: $nodes[nodeArrayPosition].position.y + (originalParentPositionAbs.y - $nodes[parentNodeId].computed.positionAbsolute.y),
      }
    }
    $nodes.forEach((n) => (n.class = ""));
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
