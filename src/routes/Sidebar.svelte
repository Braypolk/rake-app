<script lang="ts">
  import { useNodes, useEdges } from "@xyflow/svelte";

  const nodes = useNodes();
  const edges = useEdges();

  const onDragStart = (event: DragEvent, nodeType: string) => {
    if (!event.dataTransfer) {
      return null;
    }

    event.dataTransfer.setData("application/svelteflow", nodeType);

    event.dataTransfer.effectAllowed = "move";
  };

  const deploy = async () => {
    // change all status to syncing
    nodes.update((currentNodes) => {
      currentNodes.map((node) => {
        node.data = { ...node.data, status: "syncing" };
      });
      return currentNodes;
    });
    // console.log($nodes[1].data.status);
    const resources = $nodes.map((node) => {
      const { parentNode, ...rest } = node;
      return {
        ...rest,
        id: parseInt(node.id),
        project: parseInt(parentNode),
      };
    });
    const relationships = $edges.map((edge) => {});

    const result = await runPythonFile(resources);

    // if (result == 'success') {
    //   // change all status to synced
    //   nodes.update((currentNodes) => {
    //     currentNodes.map((node) => {
    //       node.data = { ...node.data, status: "synced" };
    //     });
    //     return currentNodes;
    //   });
    // }
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
        return 'success';
      } else {
        // Handle error response
        console.error("Failed to run Python file");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
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
