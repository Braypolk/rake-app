<script>
  import { variables } from "$lib/nodes-edges";

  let inputString = "this-is{yetAnother}otherstring";
  let parts = [];

  // Extract text between curly braces and the text outside them
  function extractText(input) {
    const regex = /{([^}]+)}/g;
    // A regular expression to match text between curly braces
    let match;
    let lastIndex = 0;
    parts = [];

    while ((match = regex.exec(input)) !== null) {
      // Push text outside of curly braces, if any
      if (match.index > lastIndex) {
        parts.push(input.slice(lastIndex, match.index));
      }
      // Push text inside curly braces
      parts.push("!" + $variables[$variables.findIndex((obj) => obj.name === match[1])].id);
      lastIndex = regex.lastIndex;
    }

    // Push remaining text after the last curly brace, if any
    if (lastIndex < input.length) {
      parts.push(input.slice(lastIndex));
    }

    console.log(parts);
  }

  extractText(inputString);
</script>

<p>
  {#each parts as part}
    {#if part.startsWith("!")}
      <span style="color: red"
        >{$variables[
          $variables.findIndex((obj) => obj.id === parseInt(part.substring(1)))
        ].name}</span
      >
    {:else}
      {part}
    {/if}
  {/each}
</p>
