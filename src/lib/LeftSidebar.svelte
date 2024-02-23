<script lang="ts">
  import { leftSidebarSize, draggingNodeType } from "$lib/nodes-edges";

  const onDragStart = (event: DragEvent, nodeType: string) => {
    if (!event.dataTransfer) {
      return null;
    }

    // might be kinda jank beause of the DnD api but it works
    $draggingNodeType = nodeType;
    event.dataTransfer.setData("application/svelteflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
</script>

<svelte:window
  on:keydown={(e) => {
    // may need more logic so it doesn't fire anytime esc is pressed
    if (e.key === "Escape") {
      $leftSidebarSize = 0;
    }
  }}
/>

<div>
  <!-- TODO: eventually this group will be a project node -->
  <div
    class="projectDrag blob"
    on:dragstart={(event) => onDragStart(event, "Project")}
    draggable={true}
  >
    Project
  </div>
  <div
    class="bucketDrag blob"
    on:dragstart={(event) => onDragStart(event, "Bucket")}
    draggable={true}
  >
    Bucket
  </div>
  <div
    class="networkDrag blob"
    on:dragstart={(event) => onDragStart(event, "Network")}
    draggable={true}
  >
    Network
  </div>
  <div
    class="subnetworkDrag blob"
    on:dragstart={(event) => onDragStart(event, "Subnetwork")}
    draggable={true}
  >
    Subnetwork
  </div>
  <div
    class="instanceDrag blob"
    on:dragstart={(event) => onDragStart(event, "Instance")}
    draggable={true}
  >
    Instance
  </div>
  <!-- <div
      class="firewall blob"
      on:dragstart={(event) => onDragStart(event, "Firewall")}
      draggable={true}
    >
      Firewall
    </div>
    <div
      class="instancegroup blob"
      on:dragstart={(event) => onDragStart(event, "InstanceGroup")}
      draggable={true}
    >
      InstanceGroup
    </div>
    <div
      class="router blob"
      on:dragstart={(event) => onDragStart(event, "Router")}
      draggable={true}
    >
      Router
    </div>
    <div
      class="backendservice blob"
      on:dragstart={(event) => onDragStart(event, "BackendService")}
      draggable={true}
    >
      BackendService
    </div> -->
    <div
        class="for blob"
        on:dragstart={(event) => onDragStart(event, "For")}
        draggable={true}
        >
            For
        </div>
<!-- END OF NODES -->
</div>

<style>
  .show {
    left: 0;
  }

  .label {
    margin: 0.5rem 0 0.25rem 0;
  }

  .blob {
    margin-bottom: 0.5rem;
    border: 1px solid #111;
    padding: 0.5rem 1rem;
    font-weight: 700;
    border-radius: 3px;
    cursor: grab;
  }
</style>
