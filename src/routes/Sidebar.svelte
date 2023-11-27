<script lang="ts">
  import { useSvelteFlow } from "@xyflow/svelte";
  import { useNodes, useEdges } from "@xyflow/svelte";
  import { onMount } from "svelte";
  // import { nodes, edges, getId } from "$lib/nodes-edges";

  const { toObject } = useSvelteFlow();

  const nodesState = useNodes();
  const edgesState = useEdges();

  async function onSave() {
    const flow = toObject();

    try {
      const response = await fetch("/api/flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flow: flow,
          location:
            "/Users/braypolkinghorne/Documents/code/Rake/rake-app/src/lib/test.json",
        }), //todo: will have to be changed when not using local storage
      });

      if (response.ok) {
        console.log("Flow saved successfully");
      } else {
        console.error("Failed to save flow");
      }
    } catch (error) {
      console.error("Error saving flow:", error);
    }
  }

  async function onRestore() {
    try {
      //todo: will have to be changed when not using local storage
      const response = await fetch(
        "/api/flow?location=/Users/braypolkinghorne/Documents/code/Rake/rake-app/src/lib/test.json"
      );

      if (response.ok) {
        console.log("Flow restored successfully");
        const res = await response.json();

        const { flow, message } = res.body;

        if (flow) {
          const { x, y, zoom, nodes, edges } = flow;
          nodesState.set(nodes);
          edgesState.set(edges);
        } else {
          console.log(message);
        }
      } else {
        console.error("Failed to restore flow");
      }
    } catch (error) {
      console.error("Error restoring flow:", error);
    }
  }

  const onDragStart = (event: DragEvent, nodeType: string) => {
    if (!event.dataTransfer) {
      return null;
    }

    event.dataTransfer.setData("application/svelteflow", nodeType);

    event.dataTransfer.effectAllowed = "move";
  };

  const deploy = async () => {
    // change all status to syncing
    nodesState.update((currentNodes) => {
      currentNodes.map((node) => {
        node.data = { ...node.data, status: "syncing" };
      });
      return currentNodes;
    });

    const resources = $nodesState.map((node) => {
      const { parentNode, ...rest } = node;
      return {
        ...rest,
        id: parseInt(node.id),
        project: parseInt(parentNode),
      };
    });
    const relationships = $edgesState.map((edge) => {});

    const result = await runPythonFile(resources);
    onSave();
  };

  async function runPythonFile(resources) {
    try {
      console.log(resources);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(resources),
      });

      if (response.ok) {
        // Handle successful response
        const result = await response.json();
        console.log(result);
        return "success";
      } else {
        // Handle error response
        console.error("Failed to run Python file");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  onMount(() => {
    // load user state
    onRestore();
  });
</script>

<aside class="w-full bg-surface-800 py-2 px-4">
  <div class="label">You can drag these nodes to the pane on the left.</div>
  <div class="components">
    <div
      class="bucket-node node"
      on:dragstart={(event) => onDragStart(event, "Bucket")}
      draggable={true}
    >
      Bucket Node
    </div>
    <div
      class="input-node node"
      on:dragstart={(event) => onDragStart(event, "input")}
      draggable={true}
    >
      Input Node
    </div>
    <div
      class="default-node node"
      on:dragstart={(event) => onDragStart(event, "default")}
      draggable={true}
    >
      Default Node
    </div>
    <div
      class="output-node node"
      on:dragstart={(event) => onDragStart(event, "output")}
      draggable={true}
    >
      Output Node
    </div>
    <div
      class="output-node node"
      on:dragstart={(event) => onDragStart(event, "group")}
      draggable={true}
    >
      Group
    </div>
  </div>
  <button on:click={deploy}>Deploy</button>
  <button on:click={onSave}>Save</button>
  <button on:click={onRestore}>Restore</button>
</aside>

<style>
  .label {
    margin: 0.5rem 0 0.25rem 0;
  }

  .components {
    display: flex;
    flex-wrap: wrap;
  }

  .node {
    margin-bottom: 0.5rem;
    border: 1px solid #111;
    padding: 0.5rem 1rem;
    font-weight: 700;
    border-radius: 3px;
    cursor: grab;
  }
</style>
