<script lang="ts" context="module">
  import type { Node } from "@xyflow/svelte";
  import { nodes, getId } from "$lib/nodes-edges";
  import { get } from "svelte/store";

  export function onDragOver(event: DragEvent) {
    event.preventDefault();

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }

  export function onDrop(
    event: DragEvent,
    pos: { x: number; y: number }
  ): Node[] | null {
    event.preventDefault();

    if (!event.dataTransfer) {
      return null;
    }

    const type = event.dataTransfer.getData("application/svelteflow");
    let newId = getId();

    let newNode: Node;

    if (type == "Bucket") {
      newNode = {
        id: `${newId}`,
        type,
        data: {
          location: "US",
          name: "test",
          publicState: false,
          status: "unsynced",
        },
        // project the screen coordinates to pane coordinates
        position: pos,
        parentNode: "0",
        // set the origin of the new node so it is centered
        origin: [0.5, 0.5],
      };
    } else if (type == "Network") {
      newNode = {
        id: `${newId}`,
        type,
        data: {
          name: "",
          description: "",
          routingMode: "REGIONAL",
          status: "unsynced",
        },
        // project the screen coordinates to pane coordinates
        position: pos,
        parentNode: "0",
        // set the origin of the new node so it is centered
        origin: [0.5, 0.5],
      };
    } else if (type == "Subnetwork") {
      newNode = {
        id: `${newId}`,
        type,
        data: {
          name: "",
          ipCidrRange: "",
          region: "us-central1",
          status: "unsynced",
          network: -1, // TODO: get network id from existing networks
        },
        // project the screen coordinates to pane coordinates
        position: pos,
        parentNode: "0",
        // set the origin of the new node so it is centered
        origin: [0.5, 0.5],
      };
    } else if (type == "Instance") {
      newNode = {
        id: `${newId}`,
        type,
        data: {
          name: "",
          subnetwork: -1, // TOOD: get subnetwork id from existing networks
          machineType: "e2-medium",
          bootDisk: "debian-cloud/debian-11",
          zone: "us-central1-a", // TODO: zone should be auto populated from subnetwork
          status: "unsynced",
        },
        // project the screen coordinates to pane coordinates
        position: pos,
        parentNode: "0",
        // set the origin of the new node so it is centered
        origin: [0.5, 0.5],
      };
    } else {
      newNode = {
        id: `${newId}`,
        type,
        data: { label: `Node ${newId}`, status: "unsynced" },
        // project the screen coordinates to pane coordinates
        position: pos,
        // set the origin of the new node so it is centered
        origin: [0.5, 0.5],
      };
    }
    newNode.class = "bg-gray-200";
    get(nodes).push(newNode);
    return get(nodes);
  }
</script>
