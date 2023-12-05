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
    incrementNodeId,
    addNodes,
    findNode,
  } from "$lib/nodes-edges";
  import { nodeTypes } from "$lib/nodeComponents/nodeComponents";
  import "@xyflow/svelte/dist/style.css";
  import type { Node, Edge } from "@xyflow/svelte";

  const { screenToFlowPosition, getIntersectingNodes } = useSvelteFlow();

  $: console.log($nodes);

  function onDragOver(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }

  function onDrop(event: DragEvent): void {
    event.preventDefault();

    const pos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    // const pos = { x: event.clientX, y: event.clientY };

    if (!event.dataTransfer) {
      return;
    }

    const type = event.dataTransfer.getData("application/svelteflow");
    
    let newNode: Node;
    if (type == "Bucket") {
      newNode = {
        id: incrementNodeId(),
        type,
        data: {
          location: "US",
          name: "test",
          publicState: false,
          status: "unsynced",
        },
        // project the screen coordinates to pane coordinates
        position: pos,
        parentNode: "",
        // set the origin of the new node so it is centered
        origin: [0.5, 0.5],
      };
    } else if (type == "Network") {
      newNode = {
        id: incrementNodeId(),
        type,
        data: {
          name: "",
          description: "",
          routingMode: "REGIONAL",
          status: "unsynced",
        },
        // project the screen coordinates to pane coordinates
        position: pos,
        parentNode: "",
        // set the origin of the new node so it is centered
        origin: [0.5, 0.5],
        // class: "target"
      };
    } else if (type == "Subnetwork") {
      newNode = {
        id: incrementNodeId(),
        type,
        data: {
          name: "",
          ipCidrRange: "",
          region: "us-central1",
          status: "unsynced",
          network: -1, // TODO: get network id from existing networks
        },
        // project the screen coordinates to pane coordinates
        position: pos,
        parentNode: "",
        // set the origin of the new node so it is centered
        origin: [0.5, 0.5],
      };
    } else if (type == "Instance") {
      newNode = {
        id: incrementNodeId(),
        type,
        data: {
          name: "",
          subnetwork: -1, // TOOD: get subnetwork id from existing networks
          machineType: "e2-medium",
          bootDisk: "debian-cloud/debian-11",
          zone: "us-central1-a", // TODO: zone should be auto populated from subnetwork
          status: "unsynced",
        },
        // project the screen coordinates to pane coordinates
        position: pos,
        parentNode: "",
        // set the origin of the new node so it is centered
        origin: [0.5, 0.5],
      };
    } else if (type == "Project") {
      newNode = {
        id: incrementNodeId(),
        type,
        data: { name: "", folderIdRef: "", status: "unsynced" },
        // project the screen coordinates to pane coordinates
        position: pos,
        // set the origin of the new node so it is centered
        origin: [0.5, 0.5],
      };
    } else {
      newNode = {
        id: incrementNodeId(),
        type,
        data: { status: "unsynced" },
        // project the screen coordinates to pane coordinates
        position: pos,
        // set the origin of the new node so it is centered
        origin: [0.5, 0.5],
      };
    }
    newNode.class = "bg-gray-200";
    // $nodes = [...$nodes, newNode];
    addNodes([newNode]);
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
      if ("Project" == $nodes[findNode(intersection)].type) {
        $nodes[findNode(node.id)].parentNode = intersection;
        // todo: currently jumps on parent change.
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
