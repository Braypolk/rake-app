<script lang="ts">
  import NodeTemplate from "./NodeTemplate.svelte";
  import { nodeData } from "$lib/nodes-edges";
  export let id: string;
  $$restProps;
</script>

<!-- TODO: when handle connects to subnetwork, update network var in nodeState -->
<NodeTemplate type="Project" provider="cloudplatform" {id}>
  <div class="flex flex-wrap">
    <!-- <div>
      <label for="project-name">Name</label>
      <input
        id="project-name"
        class="nodrag"
        on:input={(evt) => {          
          $nodeData[id].name = evt.target?.value;
        }}
        value={$nodeData[id].name}
      />
    </div>
    <div>
      <label for="folder-name">Folder</label>
      <input
        id="folder-name"
        class="nodrag"
        on:input={(evt) => {
          $nodeData[id].folderId = evt.target?.value;
        }}
        value={$nodeData[id].folderId}
      />
    </div> -->
    <p class="p-5">Name: {$nodeData[id].name}</p>
    <p class="p-5">Folder Id: {$nodeData[id].folderId}</p>
  </div>
</NodeTemplate>

<style>
  :global(.svelte-flow__node-Project) {
    width: 1000px;
    height: 700px;
    background-color: rgb(255, 255, 255);
    border: 5px solid rgb(71, 112, 224);
    border-radius: 1rem;
  }
</style>
