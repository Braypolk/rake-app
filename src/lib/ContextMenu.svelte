<script lang="ts">
  import { nodes, edges, assignChildren } from "./nodes-edges";
  import { handleNodePaste } from "./keybinds";

  export let onClick: () => void;
  export let id: string;
  export let x: number;
  export let y: number;


  function duplicateNode() {
    handleNodePaste([id]);
    assignChildren();
  }
</script>

<div style="top: {y}px; left: {x}px;" class="context-menu" on:click={onClick}>
  <p style="margin: 0.5em;">
    <small>node: {id}</small>
  </p>
  <button on:click={duplicateNode}>duplicate</button>
</div>

<style>
  .context-menu {
    background: white;
    border-style: solid;
    box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
    position: absolute;
    widows: 100px;
    height: 100px;
    z-index: 10;
  }

  .context-menu button {
    border: none;
    display: block;
    padding: 0.5em;
    text-align: left;
    width: 100%;
  }

  .context-menu button:hover {
    background: white;
  }
</style>
