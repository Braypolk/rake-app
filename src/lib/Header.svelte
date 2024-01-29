<script lang="ts">
  import { onMount } from "svelte";
  import { nodes, edges, showContent, sortNodes } from "$lib/nodes-edges";
  import { useSvelteFlow } from "@xyflow/svelte";
  import { drawerOpen } from "$lib/nodes-edges";
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

  async function onRestore(resourceLocation: string) {
    try {
      //todo: will have to be changed when not using local storage
      let response;
      if (resourceLocation == "demo") {
        response = await fetch(
          "/api/flow?location=/Users/braypolkinghorne/Documents/code/Rake/rake-app/src/lib/demo.json",
        );
      } else {
        response = await fetch(
          "/api/flow?location=/Users/braypolkinghorne/Documents/code/Rake/rake-app/src/lib/test.json",
        );
      }

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

  const deploy = async () => {
    // change all status to syncing
    // TODO: should probably change to be only changing status to items that have been added or changed
    $nodes = $nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        status: node.data.status == "pendingDelete" ? "deleting" : "deploying",
      },
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
      console.log("before prune", resources);
      let filteredResources = resources.filter(
        (resource) => resource.data.status !== "deleting",
      );
      console.log("after prune", filteredResources);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(filteredResources),
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
      await onRestore("res");
    } catch (error) {
      console.error(error);
      // Additional error handling can be done here if necessary.
    }
  });
</script>

<div class="w-full h-12 bg-surface-800">
  <div class="flex h-full">
    <button
      class="btn btn-sm mr-4 absolute top-0 left-0 p-0 w-11 h-12 m-0"
      on:click={() => {
        $drawerOpen = !$drawerOpen;
      }}
    >
      <span>
        <svg viewBox="0 0 100 80" class="fill-white w-6 h-6">
          <rect width="100" height="15" />
          <rect y="30" width="100" height="15" />
          <rect y="60" width="100" height="15" />
        </svg>
      </span>
    </button>

    <div class="flex w-full justify-center align-center">
      <button class="px-5 text-left" on:click={() => fitView()}>Recenter</button
      >
      <button class="px-5 text-left" on:click={() => onRestore("res")}
        >Restore</button
      >
      <button class="px-5 text-left" on:click={() => onRestore("demo")}
        >Demo</button
      >
      <button
        class="px-5 text-left"
        on:click={() => {
          $showContent = !$showContent;
        }}>Content View</button
      >
      <button class="px-5 text-left" on:click={onSave}>Save</button>
    </div>
    <button
      class="px-5 my-2 text-left bg-primary-500 text-black rounded-md"
      on:click={deploy}>Deploy</button
    >
  </div>
</div>
