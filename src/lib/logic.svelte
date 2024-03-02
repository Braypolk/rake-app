<script lang="ts">
  import {
    renderedNodeData,
    renderedNodes,
    findNode,
    nodeData,
    nodes,
  } from "./nodes-edges";
  import { handleNodePaste } from "./keybinds";
  import { useSvelteFlow, type Node } from "@xyflow/svelte";

  const { deleteElements } = useSvelteFlow();

  let tempNodeData: { [id: string]: any } = {};
  let tempNodes: Node[] = [];

  function renderForLoop() {
    $renderedNodes = JSON.parse(JSON.stringify($nodes));
    $renderedNodeData = JSON.parse(JSON.stringify($nodeData));

    for (let i = 0; i < $nodes.length; i++) {
      if ($nodes[i].parentNode === "") {
        const visited = new Set();
        const visitList = []; // To store the order of visited nodes

        const dfsRecursive = (nodeId: string) => {
          if (visited.has(nodeId)) return;
          visited.add(nodeId);
          visitList.push(nodeId);

          if ($renderedNodeData[nodeId].children) {
            $renderedNodeData[nodeId].children.forEach((adjacentNode) => {
              dfsRecursive(adjacentNode);
            });
          }
          
          const parentNodeId: string = $nodes[findNode(nodeId)].parentNode; //7c
          const parentNodeData = $nodeData[parentNodeId];
          console.log('blah', nodeId, "parentnodeid", parentNodeId);
          

          if (parentNodeData) {
            // if parentnode is a for node
            if (parentNodeData.num) {
              if (parentNodeData.num > 1) {
                for (let index = 1; index < parentNodeData.num; index++) {
                  // todo: not handling parentnodeid correctly, duplicated nodes are being assigned to the old parent
                  handleNodePaste(
                    index,
                    renderedNodes,
                    renderedNodeData,
                    [nodeId]
                  );
                }
              }
              console.log(JSON.parse(JSON.stringify($renderedNodeData)));
            }
            
          }
        };
        dfsRecursive($nodes[i].id);
      }
    }

    // remove for loops from $renderedNodes and renderedNodeData
    // [...$renderedNodes].forEach((node) => {
    //   if (node.type === "For") {
    //     let children: string[] = $renderedNodeData[node.id].children;

    //     delete $renderedNodeData[node.id];

    //     $renderedNodes = $renderedNodes.filter((item) => {
    //       // remove for node from array
    //       if (item.id !== node.id) {
    //         return true;
    //       }

    //     //   const parentNodeId = item.parentNode;
    //     //   // remove for loop id for parent's children array and assign for loop's children to new parent
    //     //   if ($renderedNodeData[parentNodeId]) {
    //     //     $renderedNodes = $renderedNodeData[parentNodeId].children.filter(
    //     //       (item) => item.id !== node.id,
    //     //     );
    //     //     $renderedNodeData[parentNodeId].children = [
    //     //       ...$renderedNodeData[parentNodeId].children,
    //     //       ...children,
    //     //     ];
    //     //   }
    //     });
    //   }
    // });
    // console.log($renderedNodeData, $renderedNodes);
  }

  function handleCheck(e) {
    if (e.target.checked) {
      tempNodes = JSON.parse(JSON.stringify($nodes));
      tempNodeData = JSON.parse(JSON.stringify($nodeData));
      renderForLoop();
      $nodes = $renderedNodes;
      $nodeData = $renderedNodeData;
      console.log($nodes, $nodeData);
    } else {
      $nodes = tempNodes;
      $nodeData = tempNodeData;
    }
  }
</script>

<!-- <button class="px-5 text-left" on:click={() => renderForLoop()}
  >render nodes</button
> -->
<div class="flex items-center">
  <label for="subscribe">render nodes</label>
  <input
    type="checkbox"
    id="subscribe"
    name="subscribe"
    on:change={handleCheck}
  />
</div>
