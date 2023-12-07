<script lang="ts">
  import NodeTemplate from "./NodeTemplate.svelte";
  import { projectData } from "./nodeData";
  export let data = projectData;
</script>

<!-- TODO: when handle connects to subnetwork, update network var in nodeState -->
<NodeTemplate type="Project" provider="cloudplatform" {data}>
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
      data.folderIdRef = evt.target?.value;
    }}
    value={data.folderIdRef}
    on:keydown={(evt) => {
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.stopPropagation();
      }
    }}
  />
</NodeTemplate>
