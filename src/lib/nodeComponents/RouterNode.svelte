<script>
  import NodeTemplate from "$lib/nodeComponents/NodeTemplate.svelte";
  import { routerData } from "$lib/nodeComponents/nodeData";
  export let data = routerData;
</script>

<NodeTemplate type="Router" provider="compute" id={data.id}>
  <div class="property">
    <span class="property-bgp">bgp</span>
    <span
      class="info-icon"
      title="BGP information specific to this router. Structure is documented below."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.bgp = evt.target?.value;
      }}
      value={data.bgp}
    />
  </div>

  <div class="property">
    <span class="property-description">description</span>
    <span class="info-icon" title="An optional description of this resource."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.description = evt.target?.value;
      }}
      value={data.description}
    />
  </div>

  <div class="property">
    <span class="property-encryptedInterconnectRouter"
      >encryptedInterconnectRouter</span
    >
    <span
      class="info-icon"
      title="Indicates if a router is dedicated for use with encrypted VLAN attachments (interconnectAttachments)."
      >ℹ</span
    >
    <input
      type="checkbox"
      name="encryptedInterconnectRouterState"
      on:change={(evt) => {
        data.encryptedInterconnectRouter = evt.target?.checked;
      }}
    />
  </div>

  <div class="property">
    <span class="property-network">network</span>
    <span
      class="info-icon"
      title="A reference to the network to which this router belongs.">ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.network = evt.target?.value;
      }}
      value={data.network}
    />
  </div>

  <div class="property">
    <span class="property-networkRef">networkRef</span>
    <span class="info-icon" title="Reference to a Network to populate network."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.networkRef = evt.target?.value;
      }}
      value={data.networkRef}
    />
  </div>

  <div class="property">
    <span class="property-networkSelector">networkSelector</span>
    <span class="info-icon" title="Selector for a Network to populate network."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.networkSelector = evt.target?.value;
      }}
      value={data.networkSelector}
    />
  </div>

  <div class="property">
    <span class="property-project">project</span>
    <span
      class="info-icon"
      title="The ID of the project in which the resource belongs. If it is not provided, the provider project is used."
      >ℹ</span
    >
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.project = evt.target?.value;
      }}
      value={data.project}
    />
  </div>

  <div class="property">
    <span class="property-region">region</span>
    <span class="info-icon" title="Region where the router resides.">ℹ</span>
    <input
      class="nodrag"
      type="text"
      on:input={(evt) => {
        data.region = evt.target?.value;
      }}
      value={data.region}
    />
  </div>
</NodeTemplate>

<style>
  :global(.svelte-flow__node-Router) {
    background-color: rgba(131, 131, 131, 0.539);
    border: 3px solid rgb(200, 200, 200);
    border-radius: 1rem;
  }
  .info-icon {
    /* Your CSS styles */
    cursor: help; /* Change the cursor to indicate hoverable */
  }
</style>
