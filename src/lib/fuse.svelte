<script lang="ts">
  import Fuse from "fuse.js";
  import { onMount } from "svelte";
  import { variables } from "$lib/nodes-edges";
  import VarInput from "./VarInput.svelte";

  export let type = ["string", "boolean", "number"];

  $: searchList = $variables.filter((v) => type.some((t) => t === v.type));
  $: console.log(searchList);

  $: fuse = new Fuse($variables, options);
  //   export let searchList;
  let searchResults = [];
  let searchResult: {};
  let searchTerm = "";
  let inputVal = "test--things";
  let searchActive = false;
  let inputElement: HTMLParagraphElement;
  let inputRef: HTMLInputElement;
  let startOffset: number;
  const options = {
    // Search in `author` and in `tags` array
    keys: ["name", "value"],
  };

  function handleKeyDown(event) {
    if (!searchActive && event.key === "/") {
      event.preventDefault();
      const selection = window.getSelection();
      console.log(selection);

      startOffset = selection.anchorOffset;

      searchTerm = "";
      searchActive = true;
      inputRef.classList.remove("hidden");
      inputRef.focus();
    } else if (
      (searchActive && event.key === "Escape") ||
      (searchActive && event.key === "Backspace" && searchTerm === "")
    ) {
      event.preventDefault();

      // searchTerm = "";
      searchActive = false;
      inputRef.value = "";
      inputElement.focus();
      inputRef.classList.add("hidden");
    } else if (searchActive && (event.key === " " || event.key === "Enter")) {
      event.preventDefault();
      searchActive = false;
      selectSearchResult(searchResults[0]);
    } else if (searchActive) {
      searchResults = fuse.search(searchTerm);
    }
  }

  function replaceVar() {
    console.log("test");
  }

  function selectSearchResult(result: {}) {
    console.log(result);
    searchResult = result;

    const currentValue = inputElement.textContent;
    console.log(currentValue);

    // Split the current value into two parts, before and after the specified position
    const start = currentValue.substring(0, startOffset);
    const end = currentValue.substring(startOffset);
    const randomString = Math.random().toString(16).slice(2, 6);

    // Insert the string between the two parts
    // const span = `<span id="${result.item.name}-${randomString}" onlcick="test()" contenteditable="false" class="bg-primary-500 rounded-sm align-middle" style="padding: .1rem; font-size: .5rem">${result ? "{·} " + $variables[result.refIndex].name : ""}</span>`;
    // inputElement.innerHTML = `${start}${result ? span : ""}${end}`;

    // document.getElementById(`${result.item.name}-${randomString}`).onclick =
    //   () => {
    //     replaceVar();
    //   };

    // Update the cursor position to be at the end of the inserted string
    // const newPosition = startOffset;
    // const newPosition = startOffset + (result ? 1 : 0);
    // inputElement.focus();
    // inputElement.setSelectionRange(newPosition, newPosition);

    // inputElement.focus();
    // var range = document.createRange();
    // var sel = window.getSelection();

    // if (result) {
    //   range.setStart(inputElement.childNodes[2], 0);
    // } else {
    //   range.setStart(inputElement.childNodes[0], startOffset);
    // }
    // range.collapse(true);

    // sel.removeAllRanges();
    // sel.addRange(range);

    searchResults = []; // Clear search results
    // searchTerm = ""; // Reset search term
    searchActive = false; // End search
    inputRef.classList.add("hidden");
  }
  let userText = "Click here to edit";
  function handleInput() {
    userText = this.innerHTML;
  }

  onMount(() => {
    // Optionally focus the input element when the component mounts
    inputElement.focus();
  });
</script>

<div class="bg-white m-2">
  <VarInput />
  <!-- <VarInput value={inputVal} /> -->
  <p
    class="nodrag"
    bind:this={inputElement}
    contenteditable="true"
    on:keydown={handleKeyDown}
  >
    {#each inputVal as part}
      {#if part.startsWith("!")}
        <span style="color: red"
          >{$variables[
            $variables.findIndex((obj) => obj.name === part.substring(1))
          ].name}</span
        >
        <span
          id="${searchResult.name}-${randomString}"
          onlcick={test()}
          contenteditable="false"
          class="bg-primary-500 rounded-sm align-middle"
          style="padding: .1rem; font-size: .5rem"
          >${searchResult
            ? "{·} " + $variables[searchResult.refIndex].name
            : ""}</span
        >
      {:else}
        {part}
      {/if}
    {/each}
  </p>
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
