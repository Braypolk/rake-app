import type { XYPosition, Node } from "@xyflow/svelte";
import { assignChildren, draggingNodeType, findNode, newNode, nodes, nodeData, findChildren, sortNodes } from "./nodes-edges";
import { get } from "svelte/store";
import { nodeTypeToDataMap } from "./nodeComponents/nodeData";

let intersectedRef: Node | undefined;
let childNodes: { [key: string]: string } = {};
export function handleDragOver(event: DragEvent, pos: XYPosition): void {
    event.preventDefault();

    if (event.dataTransfer && get(draggingNodeType) !== "") {
        event.dataTransfer.dropEffect = "move";
        dragIntersection(pos.x, pos.y, undefined, get(draggingNodeType), undefined);
    }
}

export function handleDrop(event: DragEvent, pos: XYPosition): void {
    event.preventDefault();
    draggingNodeType.set("");

    if (!event.dataTransfer) {
        return;
    }

    const type = event.dataTransfer.getData("application/svelteflow");
    const data = { ...nodeTypeToDataMap[type] };

    if (data) {
        const createdNode = newNode(nodes, nodeData, data, pos, type);
        dropIntersection(createdNode.id, type);
    } else {
        console.log("unknown type");
    }
}

export function onNodeDragStart({ detail: { node } }: { detail: { node: Node } }) {
    childNodes = findChildren(get(nodes), node.id);
}

export function onNodeDrag({ detail: { node } }: { detail: { node: Node } }) {
    // when I drag I only want to check if the dragged node is intersecting with potential parents (ex: when dragging a network, don't have subnets be "available" intersections)

    // calculate the center point of the node from position and dimensions

    const centerX: number =
        node.computed?.positionAbsolute.x + node.computed.width / 2;
    const centerY: number =
        node.computed?.positionAbsolute.y + node.computed.height / 2;

    dragIntersection(centerX, centerY, node.id, node.type, node.parentNode);
}

export function onNodeDragStop({ detail: { node } }: { detail: { node: Node } }) {
    dropIntersection(node.id, node.type);
}

function dragIntersection(
    pointX: number,
    pointY: number,
    id: string | undefined,
    draggedNodeType: string,
    parentNode: string | undefined,
) {
    let allNodes = get(nodes);
    let allNodeData = get(nodeData);
    // find a node where the center point is inside
    // todo: this should probably be changed to find nodes that are intersecting at all, or a certain percentage is intersecting
    const intersections = allNodes.filter((n) => {
        if (
            pointX > n.computed.positionAbsolute.x &&
            pointX < n.computed.positionAbsolute.x + n.computed.width &&
            pointY > n.computed.positionAbsolute.y &&
            pointY < n.computed.positionAbsolute.y + n.computed.height &&
            n.id !== id // this is needed, otherwise we would always find the dragged node
        ) {
            return true;
        }
    });

    intersectedRef = intersections.findLast((intersectedNode) => {
        // check if dragged node is intersecting with any nodes that are already part of its hierarchy
        if (!childNodes[intersectedNode.id]) {
            // if for is being dragged and is intersected with another suitable node, hightlight the intersected node so it can become the parent when dropped
            if (draggedNodeType === "For") {
                if (allNodeData[intersectedNode.id].children && intersectedNode.parentNode !== id) {
                    return intersectedNode
                }
            }
            else if (draggedNodeType === "Project") {
                // todo: need to check the parent of the For to see if it's aleady in a project
                if (intersectedNode.type == "For" && intersectedNode.parentNode !== id) {
                    return intersectedNode
                }
                return intersectedNode.type === "Folder" ? intersectedNode : undefined;
            }
            else if (draggedNodeType === "Network" || draggedNodeType === "Instance" || draggedNodeType === "Bucket") {
                if (intersectedNode.type == "For" && intersectedNode.parentNode !== id) {

                    return intersectedNode
                }
                return intersectedNode.type === "Project" ? intersectedNode : undefined;
            }
            else if (draggedNodeType === "Subnetwork") {
                if (intersectedNode.type == "For" && intersectedNode.parentNode !== id) {
                    return intersectedNode
                }
                return intersectedNode.type === "Network" ? intersectedNode : undefined;
            }
        }
        return undefined
    });

    allNodes.forEach(
        (n) => (n.class = n.class?.replace(/\bhighlight\b/, "").trim()),
    );

    if (intersectedRef && intersectedRef.id !== parentNode) {
        intersectedRef.class = "highlight";
    }
    nodes.set(allNodes);
}

function dropIntersection(id: string, type: string) {
    let allNodes = get(nodes);

    const nodeArrayPosition = findNode(id);

    // if there is an intersection and the node is not intersected with a parent assign the node to the parent
    if (
        intersectedRef &&
        intersectedRef.id !== get(nodes)[findNode(id)].parentNode
    ) {
        let originalParentPositionAbs = { x: 0, y: 0 };
        // assign parent to node
        const parentNodeId = findNode(intersectedRef.id);
        // if a node has a parent already, remove the node (data.child) from the parent
        if (get(nodes)[nodeArrayPosition].parentNode !== "") {
            const originalParent =
                get(nodes)[findNode(get(nodes)[nodeArrayPosition].parentNode)];
            originalParentPositionAbs = originalParent.computed.positionAbsolute;
        }
        get(nodes)[nodeArrayPosition].parentNode = intersectedRef.id;
        // }

        get(nodes)[nodeArrayPosition].position = {
            x:
                get(nodes)[nodeArrayPosition].position.x +
                (originalParentPositionAbs.x -
                    get(nodes)[parentNodeId].computed.positionAbsolute.x),
            y:
                get(nodes)[nodeArrayPosition].position.y +
                (originalParentPositionAbs.y -
                    get(nodes)[parentNodeId].computed.positionAbsolute.y),
        };
        assignChildren(nodes, nodeData);
        sortNodes(nodes, nodeData);
    }

    // remove highlight from all nodes and reset intersectedRef
    get(nodes).forEach(
        (n) => (n.class = n.class?.replace(/\bhighlight\b/, "").trim()),
    );
    intersectedRef = undefined;
}