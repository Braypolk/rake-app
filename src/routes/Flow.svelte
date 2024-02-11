<script lang="ts">
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    useSvelteFlow,
    type Node,
    type Edge,
    MiniMap,
  } from "@xyflow/svelte";
  import LeftSidebar from "$lib/LeftSidebar.svelte";
  import NodeSidebar from "$lib/NodeSidebar.svelte";
  import Header from "$lib/Header.svelte";
  import {
    nodes,
    nodeData,
    edges,
    findNode,
    newNode,
    draggingNodeType,
    leftSidebarSize,
    paneSize,
  } from "$lib/nodes-edges";
  import { nodeTypeToDataMap } from "$lib/nodeComponents/nodeData";
  import { nodeTypes } from "$lib/nodeComponents/nodeComponents";
  import "@xyflow/svelte/dist/style.css";
  import { AppShell } from "@skeletonlabs/skeleton";
  import { Pane, Splitpanes } from "svelte-splitpanes";

  const { screenToFlowPosition, getIntersectingNodes } = useSvelteFlow();
  let intersectedRef: Node | undefined;

  let id: string = "";
  function onDragOver(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer && $draggingNodeType !== "") {
      event.dataTransfer.dropEffect = "move";
      const pos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      dragIntersection(pos.x, pos.y, undefined, $draggingNodeType, undefined);
    }
  }

  // TODO: not sure how to move this to another file because it can't be a svelte file because idk how to export a function, it can't be a ts file because it uses useSvelteFlow which requires a svelte file or more specifically to be a child of a svelteflow instance
  function onDrop(event: DragEvent): void {
    event.preventDefault();
    $draggingNodeType = "";

    if (!event.dataTransfer) {
      return;
    }

    const pos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const type = event.dataTransfer.getData("application/svelteflow");

    console.log(type);

    const data = { ...nodeTypeToDataMap[type] };

    if (data) {
      console.log(data);

      const node = newNode(data, pos, type);
      dropIntersection(node.id, type);
    } else {
      console.log("unknown type");
    }
  }

  function onNodeDrag({ detail: { node } }) {
    // when I drag I only want to check if the dragged node is intersecting with potential parents (ex: when dragging a network, don't have subnets be "available" intersections)

    // calculate the center point of the node from position and dimensions

    const centerX: number =
      node.computed?.positionAbsolute.x + node.computed.width / 2;
    const centerY: number =
      node.computed?.positionAbsolute.y + node.computed.height / 2;

    dragIntersection(centerX, centerY, node.id, node.type, node.parentNode);
  }

  function onNodeDragStop({ detail: { node } }) {
    dropIntersection(node.id, node.type);
  }

  function dragIntersection(
    pointX: number,
    pointY: number,
    id: string | undefined,
    type: string,
    parentNode: string | undefined,
  ) {
    // find a node where the center point is inside
    const intersections = $nodes.map((n) => {
      if (
        pointX > n.computed.positionAbsolute.x &&
        pointX < n.computed.positionAbsolute.x + n.computed.width &&
        pointY > n.computed.positionAbsolute.y &&
        pointY < n.computed.positionAbsolute.y + n.computed.height &&
        n.id !== id // this is needed, otherwise we would always find the dragged node
      ) {
        return n;
      }
    });

    // console.log(intersections);

    if (type === "Project") {
      intersectedRef = intersections.findLast((n) => {
        if (n !== undefined) {
          return n.type == "Folder" ? n : undefined;
        }
      });
    } else if (type === "Network" || type === "Instance" || type === "Bucket") {
      intersectedRef = intersections.findLast((n) => {
        if (n !== undefined) {
          return n.type === "Project" ? n : undefined;
        }
      });
    } else if (type === "Subnetwork") {
      intersectedRef = intersections.findLast((n) => {
        if (n !== undefined) {
          return n.type === "Network" ? n : undefined;
        }
      });
    }

    $nodes.forEach(
      (n) => (n.class = n.class?.replace(/\bhighlight\b/, "").trim()),
    );
    if (intersectedRef && intersectedRef.id !== parentNode) {
      intersectedRef.class = "highlight";
    }

    $nodes = $nodes;
  }

  function dropIntersection(id: string, type: string) {
    const nodeArrayPosition = findNode(id);
    if (intersectedRef) {
      let originalParentPositionAbs = { x: 0, y: 0 };
      // assign parent to node
      const parentNodeId = findNode(intersectedRef.id);
      if (
        intersectedRef.type == "Project" ||
        (intersectedRef.type == "Network" && type == "Subnetwork")
      ) {
        // if a node has a parent already, remove the node (data.child) from the parent
        if ($nodes[nodeArrayPosition].parentNode !== "") {
          const originalParent =
            $nodes[findNode($nodes[nodeArrayPosition].parentNode)];
          originalParentPositionAbs = originalParent.computed.positionAbsolute;
          delete $nodeData[originalParent.id].children[id];
        }
        $nodes[nodeArrayPosition].parentNode = intersectedRef.id;
        $nodeData[intersectedRef.id].children[id] = nodeArrayPosition;
      }

      $nodes[nodeArrayPosition].position = {
        x:
          $nodes[nodeArrayPosition].position.x +
          (originalParentPositionAbs.x -
            $nodes[parentNodeId].computed.positionAbsolute.x),
        y:
          $nodes[nodeArrayPosition].position.y +
          (originalParentPositionAbs.y -
            $nodes[parentNodeId].computed.positionAbsolute.y),
      };
    }
    $nodes.forEach(
      (n) => (n.class = n.class?.replace(/\bhighlight\b/, "").trim()),
    );
    $nodes = $nodes;
  }

  // TODO: still need to process edges, currently only looking at nodes
  async function onBeforeDelete(e: { nodes: Node[]; edges: Edge[] }) {
    // TODO: also remove children once element is deleted
    // console.log(e);

    let del = {
      nodes: [] as Node[],
      edges: [] as Edge[],
    };
    e.nodes.forEach((n) => {
      const status = $nodeData[n.id].status;

      if ($nodeData[n.id].status === "unsynced") {
        del.nodes.push(n);
      } else if ($nodeData[n.id].status === "synced") {
        console.log("change to pendingDelete");
        $nodeData[n.id].status = "pendingDelete";
        n.class = "pendingDelete";
      } else {
        // todo: have some error that tells user that the resources is currently being processed
        console.log("Resource is currently being processed");
      }
    });
    $nodes = $nodes;
    console.log($nodes);

    return del;
  }

  function handleSplitterClick(e) {
    const index = e.detail.index;

    if (index == 1) {
      $leftSidebarSize = $leftSidebarSize > 0 ? 0 : 10;
    } else if (index == 2) {
      $paneSize = $paneSize > 0 ? 0 : 20;
    }
  }

  function onNodeClick(e) {
    id = e.detail.node.id;
  }
</script>

<Header />
<Splitpanes
  theme="rake-theme"
  style="height: calc(100% - 3rem);"
  dblClickSplitter={false}
  on:splitter-click={handleSplitterClick}
>
  <Pane bind:size={$leftSidebarSize} maxSize={20} snapSize={3}>
    <LeftSidebar />
  </Pane>
  <Pane>
    <main class="h-90 p-0 m-0 w-full h-full flex flex-col">
      <SvelteFlow
        class="text-on-primary-token"
        {nodeTypes}
        {nodes}
        {edges}
        defaultEdgeOptions={{ type: "smoothstep" }}
        minZoom={0.2}
        maxZoom={4}
        proOptions={{ hideAttribution: true }}
        onbeforedelete={(e) => onBeforeDelete(e)}
        on:dragover={onDragOver}
        on:nodedrag={onNodeDrag}
        on:nodedragstop={onNodeDragStop}
        on:drop={onDrop}
        on:nodeclick={onNodeClick}
      >
        <Background
          bgColor="#0f161d"
          patternClass="opacity-10"
          variant={BackgroundVariant.Lines}
        />
        <Controls />
        <MiniMap />
      </SvelteFlow>
    </main>
  </Pane>
  <Pane bind:size={$paneSize} maxSize={50} snapSize={8}>
    <NodeSidebar />
  </Pane>
</Splitpanes>
