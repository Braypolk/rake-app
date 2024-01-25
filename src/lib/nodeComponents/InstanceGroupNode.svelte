<script>
    import NodeTemplate from "$lib/nodeComponents/NodeTemplate.svelte";
    import { instancegroupData } from "$lib/nodeComponents/nodeData";
    export let data = instancegroupData;
</script>

<NodeTemplate type="InstanceGroup" provider="compute" id={data.id}>

    <div class="property">
      <span class="property-description">description</span>
      <span class="info-icon" title="An optional textual description of the instance group.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.description = evt.target?.value;}}
        value={data.description}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-instances">instances</span>
      <span class="info-icon" title="The list of instances in the group, in self_link format. When adding instances they must all be in the same network and zone as the instance group.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.instances = evt.target?.value;}}
        value={data.instances}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-namedPort">namedPort</span>
      <span class="info-icon" title="The named port configuration. See the section below for details on configuration. Structure is documented below.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.namedPort = evt.target?.value;}}
        value={data.namedPort}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-network">network</span>
      <span class="info-icon" title="The URL of the network the instance group is in. If this is different from the network where the instances are in, the creation fails. Defaults to the network where the instances are in (if neither network nor instances is specified, this field will be blank).">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.network = evt.target?.value;}}
        value={data.network}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-networkRef">networkRef</span>
      <span class="info-icon" title="Reference to a Network to populate network.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.networkRef = evt.target?.value;}}
        value={data.networkRef}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-networkSelector">networkSelector</span>
      <span class="info-icon" title="Selector for a Network to populate network.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.networkSelector = evt.target?.value;}}
        value={data.networkSelector}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-project">project</span>
      <span class="info-icon" title="The ID of the project in which the resource belongs. If it is not provided, the provider project is used.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.project = evt.target?.value;}}
        value={data.project}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  

    <div class="property">
      <span class="property-zone">zone</span>
      <span class="info-icon" title="The zone that this instance group should be created in.">ℹ</span>
      <input 
        class="nodrag" 
        type="text" 
        on:input={(evt) => { data.zone = evt.target?.value;}}
        value={data.zone}
        on:keydown={(evt) => {
            if (evt.key === "Delete" || evt.key === "Backspace") {
                evt.stopPropagation();
            }
        }}
    />
    </div>
  
</NodeTemplate>

<style>
  :global(.svelte-flow__node-InstanceGroup) {
    background-color: rgba(131, 131, 131, 0.539);
    border: 3px solid rgb(200, 200, 200);
    border-radius: 1rem;
  }
  .info-icon {
    /* Your CSS styles */
    cursor: help; /* Change the cursor to indicate hoverable */
  }
</style>