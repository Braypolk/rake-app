import { nodeData, nodes, findNode, newNode, assignChildren, sortNodes } from '$lib/nodes-edges';
import { get, type Writable } from 'svelte/store';
import type { Node } from '@xyflow/svelte';

let copiedNodeIds: string[] = [];
let timesPasted = 1;
// todo: when selected nodes contains nodes with its children I don't want to copy the children because the parent will already copy all child nodes recursively
export function handleNodePaste(timesPasted: number, passedNodes: Writable<Node[]>, passedNodeData: Writable<{ [id: string]: any; }>, nodeIds: string[], newParent?: string) {
    nodeIds.forEach((nodeId) => {
        const data = get(passedNodeData)[nodeId];

        const nodeIndex = findNode(nodeId, passedNodes);
        const node = get(passedNodes)[nodeIndex];
        get(passedNodes)[nodeIndex].selected = false;
        const type = node.type;
        const parent = node.parentNode;
        const pos = parent == "" ? node.computed.positionAbsolute : node.position;
        const style = `width: ${node.computed?.width}px; height: ${node.computed?.height}px;`;

        const createdNode = newNode(
            passedNodes,
            passedNodeData,
            { ...data },
            newParent ? pos : { x: pos.x, y: pos.y + (node.computed?.height * timesPasted) },
            type,
            newParent ? newParent : parent,
            style,
        );

        if (data.children && data.children.length) {
            handleNodePaste(timesPasted, passedNodes, passedNodeData, data.children, createdNode.id);
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
                    timesPasted = 1;
                    copiedNodeIds = selectedNodeIds;
                }
                break;
            case "v":
                if (copiedNodeIds.length > 0) {
                    event.preventDefault();
                    handleNodePaste(timesPasted, nodes, nodeData, copiedNodeIds);
                    nodes.set(get(nodes));
                    nodeData.set(get(nodeData));
                    assignChildren(nodes, nodeData);
                    nodes.set(get(nodes));
                    nodeData.set(get(nodeData));
                    timesPasted++;
                }
                break;
            default:
                break;
        }
    }
}