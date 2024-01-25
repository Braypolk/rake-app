<script lang="ts">
  import { incrementid, nodes, findNode } from "$lib/nodes-edges";
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";

  export let type: 'source' | 'target';

  export let targetPosition: NodeProps["targetPosition"] = Position.Left;
  export let sourcePosition: NodeProps["sourcePosition"] = Position.Right;
  export let isConnectable: NodeProps["isConnectable"] = undefined;

  // from source to target
  function handleConnect(connection) {
    console.log(connection);
    
    const source = $nodes[findNode(connection[0].source)];
    console.log(source);

    if (source.type == "Subnetwork") {
      console.log("in");

      $nodes[findNode(connection[0].target)].data.subnetwork = source.id;
      console.log($nodes[findNode(connection[0].target)]);
    }
  }
</script>

<Handle
  type={type}
  position={type == 'target' ? targetPosition : sourcePosition}
  id={incrementid()}
  {isConnectable}
  style="height: 50px; width: 15px; border-radius: 5px"
  onconnect={handleConnect}
/>
