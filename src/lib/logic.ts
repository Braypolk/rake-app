import { nodeData, nodes, newNode } from "./nodes-edges";
import { get } from "svelte/store";

let allNodes;
let allnodeData;
let children = [];
export function renderForLoop() {
    allNodes = get(nodes);
    allnodeData = get(nodeData);
    let test = [];
    const arrayPosition = {}
    for (let i = 0; i < allNodes.length; i++) {
        
        arrayPosition[allNodes[i].id] = i;
    }
    
    allNodes.forEach(node => {
        if (node.type == "For") {
            //  for loop is for number of times to loop over child nodes
            // todo: would need to check if num or var is set and use accordingly
            for (let i = 1; i < allnodeData[node.id].num; i++) {
                children = [];
                dupChildren(node.id);
                test.push(...children);
                console.log(i, children);
            }
        }
    });
    console.log('test', test);
    
    // nodeData.set(allnodeData);
    // nodes.set(allNodes);
}

function dupChildren(id) {
    // check if for loop actually has children
    if (allnodeData[id].children) {
        // recursively loop over all child nodes inside of for block. If the node is another for loop, I would want to duplicate it, but not duplicate its children because the rest of the outer loop will pick that up.
        allnodeData[id].children.forEach((child: string) => {
            // console.log(allNodes[arrayPosition[child]]);
            // if (allnodeData[child].type !== "For") {
                children.push(child)
                dupChildren(child);
            // }
            // newNode(allnodeData[child.id], child.computed.positionAbsolute, child.type)
        });
    }
    return;
}