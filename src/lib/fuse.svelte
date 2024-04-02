<script lang="ts">
  import Fuse from "fuse.js";
  import { onMount } from "svelte";

  export let searchList;
  let searchResults: any[] = [];
  let searchTerm = "";
  let searchActive = false;
  let inputElement;
  let inputRef;
  let pos: number;
  const options = {
    includeScore: true,
    // Search in `author` and in `tags` array
    keys: ["name", "value"],
  };

  const fuse = new Fuse(searchList, options);

  function handleKeyDown(event) {
    if (!searchActive && event.key === "$") {
      event.preventDefault();
      pos = inputElement.selectionStart;

      searchTerm = "";
      searchActive = true;
      inputRef.classList.remove("hidden");
      inputRef.focus();
    } else if (
      (searchActive && event.key === "Escape") ||
      (searchActive && event.key === "Backspace" && searchTerm === "")
    ) {
      event.preventDefault();

      searchTerm = "";
      searchActive = false;
      inputRef.value = "";
      inputElement.focus();
      inputRef.classList.add("hidden");
    } else if (searchActive && (event.key === " " || event.key === "Enter")) {
      searchActive = false;
      searchTerm = ""; // Reset searchTerm if you want to start a new search next time '$' is pressed
      selectSearchResult(searchResults[0]);
    } else if (searchActive) {
      searchResults = fuse.search(searchTerm);
    }
  }

  function selectSearchResult(result) {
    const currentValue = inputElement.value;
    // Split the current value into two parts, before and after the specified position
    const start = currentValue.substring(0, pos);
    const end = currentValue.substring(pos);

    // Insert the string between the two parts
    inputElement.value = start + (result ? "${" + result.item.name + "}" : "") + end;

    // Update the cursor position to be at the end of the inserted string
    const newPosition = pos + (result ? result.item.name.length + 3 : 0);
    inputElement.focus();
    inputElement.setSelectionRange(newPosition, newPosition);

    searchResults = []; // Clear search results
    searchTerm = ""; // Reset search term
    searchActive = false; // End search
    inputRef.classList.add("hidden");

  }

  onMount(() => {
    // Optionally focus the input element when the component mounts
    inputElement.focus();
  });
</script>

<div>
  <input
    class="nodrag"
    type="text"
    bind:this={inputElement}
    on:keydown={handleKeyDown}
  />
  <input
    class="nodrag hidden"
    type="text"
    bind:this={inputRef}
    bind:value={searchTerm}
    on:keydown={handleKeyDown}
  />
  {#if searchActive && searchResults.length > 0}
    <div class="bg-primary-500">
      <ul>
        {#each searchResults as item}
          <li
            class="hover:bg-primary-200"
            on:click={() => selectSearchResult(item)}
          >
            {item.item.name} - {item.item.value}
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .hidden {
    display: none;
  }
</style>
