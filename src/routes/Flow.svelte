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
  import ContextMenu from "$lib/ContextMenu.svelte";
  import { on_key_down } from "$lib/keybinds";
  import {
    nodes,
    nodeData,
    edges,
    leftSidebarSize,
    paneSize,
  } from "$lib/nodes-edges";
  import { nodeTypes } from "$lib/nodeComponents/nodeComponents";
  import "@xyflow/svelte/dist/style.css";
  import { Pane, Splitpanes } from "svelte-splitpanes";
  import {
    handleDragOver,
    handleDrop,
    onNodeDrag,
    onNodeDragStart,
    onNodeDragStop,
  } from "$lib/interactions";

  const { screenToFlowPosition } = useSvelteFlow();

  let menu: {
    id: string;
    x: number;
    y: number;
  } | null = null;

  $: selectedNodeIds = $nodes
    .filter((node) => node.selected)
    .map((node) => node.id);

  function onDragOver(event: DragEvent) {
    event.preventDefault();
    handleDragOver(
      event,
      screenToFlowPosition({ x: event.clientX, y: event.clientY }),
    );
  }

  function onDrop(event: DragEvent): void {
    event.preventDefault();
    handleDrop(
      event,
      screenToFlowPosition({ x: event.clientX, y: event.clientY }),
    );
  }

  // TODO: still need to process edges, currently only looking at nodes
  async function onBeforeDelete(e: { nodes: Node[]; edges: Edge[] }) {
    // TODO: also remove children once element is deleted
    let del = {
      nodes: [] as Node[],
      edges: [] as Edge[],
    };
    e.nodes.forEach((n) => {
      if ($nodeData[n.id].status === "unsynced") {
        del.nodes.push(n);
        if (n.parentNode !== "") {
          const index = $nodeData[n.parentNode].children.indexOf(n.id);
          if (index > -1) {
            $nodeData[n.parentNode].children.splice(index, 1);
          }
        }
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
    return del;
  }

  function onDelete(e: { nodes: Node[]; edges: Edge[] }) {
    e.nodes.forEach(({id}) => {
      console.log(id);
      delete $nodeData[id];
    });
  }

  function handleSplitterClick(e) {
    const index = e.detail.index;

    if (index == 1) {
      $leftSidebarSize = $leftSidebarSize > 0 ? 0 : 10;
    } else if (index == 2) {
      $paneSize = $paneSize > 0 ? 0 : 20;
    }
  }

  function handleContextMenu({ detail: { event, node } }) {
    // Prevent native context menu from showing
    event.preventDefault();

    // Calculate position of the context menu. We want to make sure it
    // doesn't get positioned off-screen.
    menu = {
      id: node.id,
      x: event.layerX,
      y: event.layerY,
    };
  }

  // Close the context menu if it's open whenever the window is clicked.
  function handlePaneClick() {
    menu = null;
  }
</script>

<svelte:window on:keydown={(e) => on_key_down(e, selectedNodeIds)} />

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
        panOnScroll={true}
        selectionOnDrag={true}
        panOnDrag={[1,2]}
        proOptions={{ hideAttribution: true }}
        onbeforedelete={(e) => onBeforeDelete(e)}
        ondelete={(e) => onDelete(e)}
        on:dragover={onDragOver}
        on:nodedragstart={onNodeDragStart}
        on:nodedrag={onNodeDrag}
        on:nodedragstop={onNodeDragStop}
        on:drop={onDrop}
        on:nodeclick={handlePaneClick}
        on:nodecontextmenu={handleContextMenu}
        on:paneclick={handlePaneClick}
      >
        <Background
          bgColor="#0f161d"
          patternClass="opacity-10"
          variant={BackgroundVariant.Lines}
        />
        <Controls />
        <MiniMap />
        {#if menu}
          <ContextMenu
            onClick={handlePaneClick}
            id={menu.id}
            x={menu.x}
            y={menu.y}
          />
        {/if}
      </SvelteFlow>
    </main>
  </Pane>
  <Pane bind:size={$paneSize} maxSize={50} snapSize={8}>
    <NodeSidebar {selectedNodeIds} />
  </Pane>
</Splitpanes>
