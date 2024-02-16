import type { XYPosition, Node } from "@xyflow/svelte";
import { assignChildren, draggingNodeType, findNode, newNode, nodes } from "./nodes-edges";
import { get } from "svelte/store";
import { nodeTypeToDataMap } from "./nodeComponents/nodeData";

let intersectedRef: Node | undefined;

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
        const node = newNode(data, pos, type);
        dropIntersection(node.id, type);
    } else {
        console.log("unknown type");
    }
}

export function onNodeDrag({ detail: { node } }) {
    // when I drag I only want to check if the dragged node is intersecting with potential parents (ex: when dragging a network, don't have subnets be "available" intersections)

    // calculate the center point of the node from position and dimensions

    const centerX: number =
        node.computed?.positionAbsolute.x + node.computed.width / 2;
    const centerY: number =
        node.computed?.positionAbsolute.y + node.computed.height / 2;

    dragIntersection(centerX, centerY, node.id, node.type, node.parentNode);
}

export function onNodeDragStop({ detail: { node } }) {
    dropIntersection(node.id, node.type);
}

function dragIntersection(
    pointX: number,
    pointY: number,
    id: string | undefined,
    type: string,
    parentNode: string | undefined,
) {
    let allNodes = get(nodes);
    // find a node where the center point is inside
    const intersections = allNodes.map((n) => {
        if (
            pointX > n.computed.positionAbsolute.x &&
            pointX < n.computed.positionAbsolute.x + n.computed.width &&
            pointY > n.computed.positionAbsolute.y &&
            pointY < n.computed.positionAbsolute.y + n.computed.height &&
            n.id !== id // this is needed, otherwise we would always find the dragged node
        ) {
            return n;
        }
    });

    if (type === "Project") {
        intersectedRef = intersections.findLast((n) => {
            if (n !== undefined) {
                return n.type == "Folder" ? n : undefined;
            }
        });
    } else if (type === "Network" || type === "Instance" || type === "Bucket") {
        intersectedRef = intersections.findLast((n) => {
            if (n !== undefined) {
                return n.type === "Project" ? n : undefined;
            }
        });
    } else if (type === "Subnetwork") {
        intersectedRef = intersections.findLast((n) => {
            if (n !== undefined) {
                return n.type === "Network" ? n : undefined;
            }
        });
    }

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

    // if there is an intersection and the node is not intersected with a parent
    if (
        intersectedRef &&
        intersectedRef.id !== allNodes[findNode(id)].parentNode
    ) {
        let originalParentPositionAbs = { x: 0, y: 0 };
        // assign parent to node
        const parentNodeId = findNode(intersectedRef.id);
        if (
            intersectedRef.type == "Project" ||
            (intersectedRef.type == "Network" && type == "Subnetwork")
        ) {
            // if a node has a parent already, remove the node (data.child) from the parent
            if (allNodes[nodeArrayPosition].parentNode !== "") {
                const originalParent =
                    allNodes[findNode(allNodes[nodeArrayPosition].parentNode)];
                originalParentPositionAbs = originalParent.computed.positionAbsolute;
            }
            allNodes[nodeArrayPosition].parentNode = intersectedRef.id;
        }

        allNodes[nodeArrayPosition].position = {
            x:
                allNodes[nodeArrayPosition].position.x +
                (originalParentPositionAbs.x -
                    allNodes[parentNodeId].computed.positionAbsolute.x),
            y:
                allNodes[nodeArrayPosition].position.y +
                (originalParentPositionAbs.y -
                    allNodes[parentNodeId].computed.positionAbsolute.y),
        };
        assignChildren();
    }
    allNodes.forEach(
        (n) => (n.class = n.class?.replace(/\bhighlight\b/, "").trim()),
    );
    nodes.set(allNodes);
}