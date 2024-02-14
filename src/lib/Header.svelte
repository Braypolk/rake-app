<script lang="ts">
  import { onMount } from "svelte";
  import {
    nodes,
    nodeData,
    edges,
    showContent,
    sortNodes,
    leftSidebarSize,
  } from "$lib/nodes-edges";
  import { useSvelteFlow, type Node } from "@xyflow/svelte";
  import { drawerOpen } from "$lib/nodes-edges";
  const { toObject, fitView, setViewport } = useSvelteFlow();

  async function onSave() {
    const flow = toObject();

    // for each node in flow, I want to insert nodeData into the flow.node.data object
    flow.nodes.forEach((node) => {
      node.data = $nodeData[node.id];
    });

    flow.nodes.forEach((node) => {
      console.log(node.id, node.data.children);
      // console.log(node.data.children);
    });

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
          $nodes.forEach((node: Node) => {
            $nodeData[node.id] = node.data;
          });

          $edges = edges;
          // todo: do the same for edges as was done with nodeData

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
    $nodes.forEach(({ id }) => {
      console.log(id);
      $nodeData[id].status = "pendingDelete" ? "deleting" : "deploying";
    });

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

  async function runPythonFile(resources: Node[]) {
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

<div class="w-full h-12 bg-surface-800 z-40">
  <div class="flex h-full">
    <div class="flex items-center">
      <button
        class="btn btn-sm mx-2 px-2 w-11 h-12 m-0"
        on:click={() => {
          $leftSidebarSize = $leftSidebarSize > 0 ? 0 : 10;
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
      <button class="btn btn-sm px-2 mx-2">
        <svg
          class="w-6 h-6"
          width="258"
          height="257"
          viewBox="0 0 258 257"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="103.5"
            cy="103.5"
            r="88.5"
            stroke="white"
            stroke-width="30"
          />
          <line
            x1="156.607"
            y1="156.393"
            x2="246.607"
            y2="246.393"
            stroke="white"
            stroke-width="30"
          />
        </svg>
      </button>
    </div>

    <div class="flex w-full justify-center align-center">
      <button class="px-5 text-left" on:click={() => onRestore("res")}
        >Restore</button
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
