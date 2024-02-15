import { nodeData, nodes, findNode, newNode, assignChildren } from '$lib/nodes-edges';
import { get } from 'svelte/store';

let copiedNodeIds: string[] = [];
// todo: when selected nodes contains nodes with its children I don't want to copy the children because the parent will already copy all child nodes recursively
export function handleNodePaste(nodeIds: string[], newParent?: string) {
    nodeIds.forEach((nodeId) => {
        const data = get(nodeData)[nodeId];
        const allNodes = get(nodes);

        const nodeIndex = findNode(nodeId); // Replace with your actual implementation to find the node index
        const node = allNodes[nodeIndex];
        allNodes[nodeIndex].selected = false;
        const type = node.type;
        const parent = node.parentNode;
        const pos = parent == "" ? node.computed.positionAbsolute : node.position;
        const style = `width: ${node.computed?.width}px; height: ${node.computed?.height}px;`;

        const returnedNode = newNode(
            { ...data },
            newParent ? pos : { x: pos.x + 50, y: pos.y + 50 },
            type,
            newParent ? newParent : parent,
            style,
        );

        if (data.children && data.children.length) {
            handleNodePaste(data.children, returnedNode.id);
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
                    copiedNodeIds = selectedNodeIds;
                }
                break;
            case "v":
                if (copiedNodeIds.length > 0) {
                    event.preventDefault();
                    handleNodePaste(copiedNodeIds);
                    assignChildren();
                }
                break;
            default:
                break;
        }
    }
}