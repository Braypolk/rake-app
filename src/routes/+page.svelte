<script>
  import { SvelteFlowProvider } from "@xyflow/svelte";
  import Flow from "./Flow.svelte";
</script>

<div>
  <SvelteFlowProvider>
    <Flow />
  </SvelteFlowProvider>
</div>

<style>
  :global(body) {
    margin: 0;
  }
  div {
    background-color: #0d151b;
    padding: 0;
    margin: 0;
  }
</style>
