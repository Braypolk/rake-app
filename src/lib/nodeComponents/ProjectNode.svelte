<script lang="ts">
  import NodeTemplate from "./NodeTemplate.svelte";
  import { projectData } from "./nodeData";
  export let data = projectData;
</script>

<!-- TODO: when handle connects to subnetwork, update network var in nodeState -->
<NodeTemplate type="Project" provider="cloudplatform" id={data.id}>
  <label for="project-name">Name</label>
  <input
    id="project-name"
    class="nodrag"
    on:input={(evt) => {
      data.name = evt.target?.value;
    }}
    value={data.name}
    on:keydown={(evt) => {
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.stopPropagation();
      }
    }}
  />
  <label for="folder-name">Folder</label>
  <input
    id="folder-name"
    class="nodrag"
    on:input={(evt) => {
      data.folderId = evt.target?.value;
    }}
    value={data.folderId}
    on:keydown={(evt) => {
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.stopPropagation();
      }
    }}
  />
</NodeTemplate>

<style>
  :global(.svelte-flow__node-Project) {
    background-color: rgb(255, 255, 255);
    border: 5px solid rgb(71, 112, 224);
    border-radius: 1rem;
  }
</style>
