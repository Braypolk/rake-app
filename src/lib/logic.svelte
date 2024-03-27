<script lang="ts">
  import {
    renderedNodeData,
    renderedNodes,
    findNode,
    nodeData,
    nodes,
    variables,
  } from "./nodes-edges";
  import { handleNodePaste } from "./keybinds";
  import { useSvelteFlow, type Node } from "@xyflow/svelte";

  const { deleteElements } = useSvelteFlow();

  let tempNodeData: { [id: string]: any } = {};
  let tempNodes: Node[] = [];

  function renderForLoop() {
    $renderedNodes = JSON.parse(JSON.stringify($nodes));
    $renderedNodeData = JSON.parse(JSON.stringify($nodeData));

    for (let i = 0; i < $renderedNodes.length; i++) {
      $renderedNodes[i].selected = false;
      $nodes[i].selected = false;
    }

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

          const parentNodeId: string = $nodes[findNode(nodeId)].parentNode;
          const parentNodeData = $nodeData[parentNodeId];

          if (parentNodeData) {
            // if parentnode is a for node
            if (parentNodeData.num) {
              console.log(parentNodeData);
              if (parentNodeData.num > 1) {
                for (let index = 1; index < parentNodeData.num; index++) {
                  // todo: not handling parentnodeid correctly, duplicated nodes are being assigned to the old parent
                  handleNodePaste(index, renderedNodes, renderedNodeData, [
                    nodeId,
                  ]);
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
    const tempRenderedNodes = $renderedNodes;
    tempRenderedNodes.forEach((node) => {
      if (node.type === "For") {
        // get children, assign to parent, update parents children, delete for
        let children: string[] = $renderedNodeData[node.id].children;
        children.forEach((child) => {
          if (node.parentNode) {
            $renderedNodes[findNode(child, renderedNodes)].parentNode =
              node.parentNode;
            $renderedNodeData[node.parentNode].children.push(child);
          } else {
            $renderedNodes[findNode(child, renderedNodes)].parentNode = "";
          }
        });
        console.log(
          JSON.parse(JSON.stringify($renderedNodes)),
          JSON.parse(JSON.stringify($renderedNodeData)),
        );

        $renderedNodes.splice(findNode(node.id, renderedNodes), 1);
        delete $renderedNodeData[node.id];

        console.log(
          JSON.parse(JSON.stringify($renderedNodes)),
          JSON.parse(JSON.stringify($renderedNodeData)),
        );
      }
    });
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
