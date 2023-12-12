<script lang="ts">
  import { incrementid, nodes, findNode } from "$lib/nodes-edges";
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";
  import type { HandleType } from "@xyflow/system";

  export let type: HandleType;

  export let targetPosition: NodeProps["targetPosition"] = Position.Left;
  export let sourcePosition: NodeProps["sourcePosition"] = Position.Right;
  export let isConnectable: NodeProps["isConnectable"] = undefined;

  // from source to target
  function handleConnect(event) {
    const connection = event.detail.connection;
    const source = $nodes[findNode(connection.source)];
    console.log(source.data.name);

    if (source.type == "Subnetwork") {
      console.log("in");

      $nodes[findNode(connection.target)].data.subnetwork = source.id;
      console.log($nodes[findNode(connection.target)]);
    }
  }
</script>

<Handle
  type={type}
  position={type == 'target' ? targetPosition : sourcePosition}
  id={incrementid()}
  {isConnectable}
  style="height: 50px; width: 15px; border-radius: 5px"
  on:connect={handleConnect}
/>
