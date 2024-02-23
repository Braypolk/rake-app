import { nodeData, nodes, findNode, newNode, assignChildren } from '$lib/nodes-edges';
import { get } from 'svelte/store';

let copiedNodeIds: string[] = [];
let timesPasted = 0;
// todo: when selected nodes contains nodes with its children I don't want to copy the children because the parent will already copy all child nodes recursively
export function handleNodePaste(nodeIds: string[], newParent?: string) {
    nodeIds.forEach((nodeId) => {
        const data = get(nodeData)[nodeId];
        const curentNodes = get(nodes);

        const nodeIndex = findNode(nodeId); // Replace with your actual implementation to find the node index
        const node = curentNodes[nodeIndex];
        curentNodes[nodeIndex].selected = false;
        const type = node.type;
        const parent = node.parentNode;
        const pos = parent == "" ? node.computed.positionAbsolute : node.position;
        const style = `width: ${node.computed?.width}px; height: ${node.computed?.height}px;`;

        const createdNode = newNode(
            nodes,
            { ...data },
            newParent ? pos : { x: pos.x, y: pos.y + (node.computed?.height * timesPasted) },
            type,
            newParent ? newParent : parent,
            style,
        );
        nodes.set

        if (data.children && data.children.length) {
            handleNodePaste(data.children, createdNode.id);
        }
    });
}


export function on_key_down(event: KeyboardEvent & { currentTarget: EventTarget & Window; }, selectedNodeIds: string[]) {
    const { key, ctrlKey, altKey, metaKey, repeat } = event;
    // need to hanle this correctly, right now when holding down a key it does nothing, I want it to act like normal and send the key
    if (repeat) {
        console.log(repeat);
        return;
    }

    if (metaKey || ctrlKey) {
        switch (key) {
            case "c":
                if (selectedNodeIds.length > 0) {
                    event.preventDefault();
                    timesPasted = 0;
                    copiedNodeIds = selectedNodeIds;
                }
                break;
            case "v":
                if (copiedNodeIds.length > 0) {
                    event.preventDefault();
                    timesPasted++;
                    handleNodePaste(copiedNodeIds);
                    assignChildren();
                }
                break;
            default:
                break;
        }
    }
}