<script lang="ts">
  import type { NodeProps } from "@xyflow/svelte";
  import { useSvelteFlow, NodeResizer } from "@xyflow/svelte";
  import { onMount, onDestroy } from "svelte";
  import { findNode, nodes, showContent, nodeData } from "$lib/nodes-edges";

  const { toObject } = useSvelteFlow();

  type $$Props = NodeProps;

  //  when setting type it should be singular
  export let type: $$Props["type"];
  $: typelower = type?.toLowerCase();

  export let provider = "";
  export let id: string;

  // test to make sure this works when the order of the array changes
  $: node = $nodes[findNode(id)];
  $: selected = node.selected;

  

  let intervalId: any;

  // todo: this is duplicated from the sidebar. maybe try to not have it be the exact same code
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

  onMount(() => {
    // check status every 5 seconds
    // TODO: should probably change this so it's not on every component
    intervalId = setInterval(async () => {
      try {
        if ($nodeData[id].status !== "pendingDelete") {
          const response = await fetch(
            `http://localhost:8001/apis/${provider}.gcp.upbound.io/v1beta1/${typelower}s/${$nodeData[id].name}/status`,
          );
          if (!response.ok) {
            console.log($nodeData[id].status);
            if ($nodeData[id].status == "deleting") {
              console.log("deleted");
              $nodes.splice(findNode(id), 1);
              // todo: also remove any edges connected to this node or try to use the svelte flow deleteNodes hook
              $nodes = $nodes;
              onSave();
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          if ($nodeData[id].status !== "deleting") {
            // bug: something here is not being set correctly and it is preemtivly being set to synced
            const clusterStatus = await response.json();
            if (clusterStatus.status) {
              // console.log(
              //   clusterStatus.status.conditions[0].reason,
              //   clusterStatus.status.conditions[0].status,
              // );
              if (clusterStatus.status.conditions[0].status) {
                $nodeData[id].status = "synced";
              }
            } else {
              $nodeData[id].status = "syncing";
              console.log("waiting...");
            }
          }
        } else {
          console.log("pendingDelete, not checking status...");
        }
      } catch (error) {
        // console.error("Failed to fetch network status:", error);
        // bug: this is currently not a complete test. if the deploying stage fails, it will remain in the deploying state
        if ($nodeData[id].status != "deploying") {
          $nodeData[id].status = "unsynced";
        }
      }
    }, 500 * 1000);
  });

  onDestroy(() => {
    clearInterval(intervalId);
  });

  console.log($nodeData[id].status);
  
</script>

<NodeResizer
  minWidth={100}
  minHeight={30}
  isVisible={selected}
  color="#ff0000"
/>
<div class={` node`}>
  <div class="flex flex-wrap justify-start items-center">
    <span class="pr-2">
      {#if $nodeData[id].status == "unsynced"}
        <svg
          style="height: 20px; width: 20px;"
          width="253"
          height="192"
          viewBox="0 0 253 192"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M80.1797 15.4518L105.671 40.9428C114.8 36.1638 124.321 34.2216 133.423 36.4022C148.787 40.0832 157.677 47.1575 163.075 54.4631C168.693 62.0665 171.304 71.0133 172.081 79.0652L173.608 94.8838H189.5C196.639 94.8838 202.713 96.1532 207.101 98.7039C210.872 100.895 214.554 104.645 216.476 112.717C218.097 119.524 216.345 125.092 212.764 129.683C209.932 133.313 206.114 136.062 202.42 137.692L227.909 163.181C232.522 159.842 236.763 155.822 240.361 151.21C249.655 139.295 254.903 123.003 250.524 104.61C246.446 87.4825 236.988 75.5919 224.689 68.4436C218.075 64.5996 211.062 62.3645 204.302 61.1486C201.893 52.1134 197.808 42.574 191.225 33.6645C180.723 19.4501 164.613 7.88448 141.577 2.36546C118.354 -3.19839 97.1347 4.49348 81.7002 14.4514C81.1898 14.7807 80.6829 15.1142 80.1797 15.4518ZM212.938 173.666L48.9381 9.66599L30.8458 27.7582L45.719 42.6314C38.394 45.209 30.9463 49.2294 24.3005 54.7125C11.0182 65.6708 0.5 82.8716 0.5 106.384C0.5 129.893 11.015 147.104 24.2882 158.075C36.8987 168.498 52.4111 173.664 64.5 173.664H176.751L194.846 191.758L212.938 173.666ZM64.5 138.664H141.751L77.2513 74.1636H64.5C61.0711 74.1636 53.3309 76.1357 46.5745 81.71C40.4818 86.7367 35.5 94.396 35.5 106.384C35.5 118.375 40.485 126.054 46.5868 131.098C53.3513 136.689 61.0889 138.664 64.5 138.664Z"
            fill="#444444"
          />
        </svg>
      {:else if $nodeData[id].status == "deploying"}
        <svg
          style="height: 20px; width: 20px;"
          width="253"
          height="199"
          viewBox="0 0 253 199"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M189.5 156.16H202C219.5 152.38 239.5 133.86 233.5 108.66C227.5 83.4596 207.22 77.3798 189.5 77.3798C187.5 56.6596 175.9 28.5798 137.5 19.3798C103.5 11.234 72.3333 41.1596 64.5 56.6596C49 56.6596 18 70.8798 18 106.38C18 141.88 49 156.16 64.5 156.16"
            stroke="#31A6FA"
            stroke-width="35"
          />
          <path
            d="M90.6023 161.242C87.7064 152.249 88.3161 130.743 108.435 119.175C126.726 108.658 141.815 116.431 149.588 121.918"
            stroke="#31A6FA"
            stroke-width="18"
          />
          <path
            d="M162.107 130.002C162.252 130.593 161.839 131.176 161.232 131.235L142.886 133.019C142.034 133.102 141.478 132.144 141.974 131.446L155.933 111.758C156.428 111.059 157.516 111.267 157.72 112.099L162.107 130.002Z"
            fill="#31A6FA"
          />
          <path
            d="M162.392 141.123C166.05 149.811 166.964 171.302 145.473 184.105C126.128 195.629 106.149 185.02 101.119 179.075"
            stroke="#31A6FA"
            stroke-width="18"
          />
          <path
            d="M90.796 172.821C90.651 172.229 91.0642 171.647 91.6705 171.588L110.016 169.803C110.869 169.72 111.425 170.678 110.929 171.377L96.9699 191.064C96.4744 191.763 95.3868 191.556 95.1829 190.724L90.796 172.821Z"
            fill="#31A6FA"
          />
        </svg>
      {:else if $nodeData[id].status == "syncing"}
        <svg
          style="height: 20px; width: 20px;"
          width="253"
          height="199"
          viewBox="0 0 253 199"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M189.5 156.16H202C219.5 152.38 239.5 133.86 233.5 108.66C227.5 83.4596 207.22 77.3798 189.5 77.3798C187.5 56.6596 175.9 28.5798 137.5 19.3798C103.5 11.234 72.3333 41.1596 64.5 56.6596C49 56.6596 18 70.8798 18 106.38C18 141.88 49 156.16 64.5 156.16"
            stroke="#FAE531"
            stroke-width="35"
          />
          <path
            d="M90.6023 161.242C87.7064 152.249 88.3161 130.743 108.435 119.175C126.726 108.658 141.815 116.431 149.588 121.918"
            stroke="#FAE531"
            stroke-width="18"
          />
          <path
            d="M162.107 130.002C162.252 130.593 161.839 131.176 161.232 131.235L142.886 133.019C142.034 133.102 141.478 132.144 141.974 131.446L155.933 111.758C156.428 111.059 157.516 111.267 157.72 112.099L162.107 130.002Z"
            fill="#FAE531"
          />
          <path
            d="M162.392 141.123C166.05 149.811 166.964 171.302 145.473 184.105C126.128 195.629 106.149 185.02 101.119 179.075"
            stroke="#FAE531"
            stroke-width="18"
          />
          <path
            d="M90.796 172.821C90.651 172.229 91.0642 171.647 91.6705 171.588L110.016 169.803C110.869 169.72 111.425 170.678 110.929 171.377L96.9699 191.064C96.4744 191.763 95.3868 191.556 95.1829 190.724L90.796 172.821Z"
            fill="#FAE531"
          />
        </svg>
      {:else if $nodeData[id].status == "synced"}
        <svg
          style="height: 20px; width: 20px;"
          width="253"
          height="174"
          viewBox="0 0 253 174"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M64.5 156.16H184H202C219.5 152.38 239.5 133.86 233.5 108.66C227.5 83.4596 207.22 77.3798 189.5 77.3798C187.5 56.6596 175.9 28.5798 137.5 19.3798C103.5 11.234 72.3333 41.1596 64.5 56.6596C49 56.6596 18 70.8798 18 106.38C18 141.88 49 156.16 64.5 156.16Z"
            stroke="#20C820"
            stroke-width="35"
          />
        </svg>
      {:else if $nodeData[id].status == "pendingDelete"}
        <svg
          style="height: 20px; width: 20px;"
          width="311"
          height="381"
          viewBox="0 0 311 381"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M35 104.5V344C35 353.389 42.6112 361 52 361H115M275 104.5V344C275 353.389 267.389 361 258 361H195M115 361V175.5M115 361H195M195 361L195 175.5"
            stroke="#FF0000"
            stroke-width="40"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 86H38.4873H272.044H310.531C310.001 65.1992 292.973 48.5 272.044 48.5H38.4873C17.5586 48.5 0.530343 65.1992 0 86Z"
            fill="#FF0000"
          />
          <path
            d="M115.5 67V30C115.5 18.9543 124.454 10 135.5 10H175.5C186.545 10 195.5 18.9543 195.5 30V67"
            stroke="#FF0000"
            stroke-width="20"
            stroke-linecap="square"
          />
        </svg>
      {:else if $nodeData[id].status == "deleting"}
        <svg
          style="height: 20px; width: 20px;"
          width="311"
          height="381"
          viewBox="0 0 311 381"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M35 104.5V344C35 353.389 42.6112 361 52 361H115M275 104.5V344C275 353.389 267.389 361 258 361H195M115 361V175.5M115 361H195M195 361L195 175.5"
            stroke="#444444"
            stroke-width="40"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 86H38.4873H272.044H310.531C310.001 65.1992 292.973 48.5 272.044 48.5H38.4873C17.5586 48.5 0.530343 65.1992 0 86Z"
            fill="#444444"
          />
          <path
            d="M115.5 67V30C115.5 18.9543 124.454 10 135.5 10H175.5C186.545 10 195.5 18.9543 195.5 30V67"
            stroke="#444444"
            stroke-width="20"
            stroke-linecap="square"
          />
        </svg>
      {/if}
    </span>
    <h1 class="text-lg pr-5">{type}</h1>
    {#if $showContent}
      <slot />
    {:else}
      <div class="placeholder">
        <div />
        <div />
        <div />
      </div>
    {/if}
  </div>
</div>

<style>
  .placeholder {
    background: unset;
  }

  .placeholder div {
    background: #eee;
    width: 100px;
    height: 10px;
    margin-bottom: 4px;
  }

  .placeholder div:last-child {
    margin-bottom: 0;
  }
</style>
