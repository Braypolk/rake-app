<script lang="ts">
  import { useSvelteFlow } from "@xyflow/svelte";
  import { onMount } from "svelte";
  import { nodes, edges, sortNodes } from "$lib/nodes-edges";

  const { toObject, fitView, setViewport } = useSvelteFlow();

  async function onSave() {
    const flow = toObject();
    console.log("flow", flow);

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
        "/api/flow?location=/Users/braypolkinghorne/Documents/code/Rake/rake-app/src/lib/test.json",
      );

      if (response.ok) {
        const res = await response.json();
        const { flow, message } = res.body;

        if (flow) {
          const { x, y, zoom, nodes, edges } = flow;
          
          $nodes = nodes;
          sortNodes();

          $edges = edges;

          fitView();
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
    $nodes = $nodes.map((node) => ({
      ...node,
      data: { ...node.data, status: "deployed" },
    }));

    const resources = $nodes.map((node) => {
      const { parentNode, ...rest } = node;
      return {
        ...rest,
        project: parentNode,
      };
    });
    const relationships = $edges.map((edge) => {});

    // TODO: uncomment when I actually want to test running things
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

  onMount(async () => {
    try {
      // load user state
      await onRestore();
    } catch (error) {
      console.error(error);
      // Additional error handling can be done here if necessary.
    }
  });
</script>

<aside class="w-full bg-surface-800 py-2 px-4 flex justify-between">
  <div class="components flex items-center justify-center">
    <!-- TODO: eventually this group will be a project node -->
    <div
      class="project blob"
      on:dragstart={(event) => onDragStart(event, "Project")}
      draggable={true}
    >
      Project
    </div>
    <div
      class="bucket blob"
      on:dragstart={(event) => onDragStart(event, "Bucket")}
      draggable={true}
    >
      Bucket
    </div>
    <div
      class="network blob"
      on:dragstart={(event) => onDragStart(event, "Network")}
      draggable={true}
    >
      Network
    </div>
    <div
      class="subnetwork blob"
      on:dragstart={(event) => onDragStart(event, "Subnetwork")}
      draggable={true}
    >
      Subnetwork
    </div>
    <div
      class="instance blob"
      on:dragstart={(event) => onDragStart(event, "Instance")}
      draggable={true}
    >
      Instance
    </div>
  </div>
  <div class="flex flex-col">
    <button class="px-5 py-2 text-left" on:click={() => fitView()}>Recenter</button>
    <!-- <button class="px-5 py-2 text-left" on:click={deploy}>Deploy</button> -->
    <button class="px-5 py-2 text-left" on:click={onSave}>Save</button>
    <button class="px-5 py-2 text-left" on:click={onRestore}>Restore</button>
  </div>
</aside>

<style>
  .label {
    margin: 0.5rem 0 0.25rem 0;
  }

  .components {
    display: flex;
    flex-wrap: wrap;
  }

  .blob {
    margin-bottom: 0.5rem;
    border: 1px solid #111;
    padding: 0.5rem 1rem;
    font-weight: 700;
    border-radius: 3px;
    cursor: grab;
  }
</style>
