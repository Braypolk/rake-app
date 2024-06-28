<script lang="ts">
  import { variables } from "./nodes-edges";

  let errorMessage = false;

  function addVariable() {
    $variables = [...$variables, { name: "", type: "string", value: "" }];
  }

  function removeVariable(index) {
    $variables = $variables.filter((_, i) => i !== index);
  }

  function handleNameInput(event, index) {
    const newName = event.target.value;
    if (newName.includes(" ")) {
      if (!errorMessage) {
        errorMessage = true;
        setTimeout(() => {
          errorMessage = false;
        }, 2000);
      }
      const newNameWithoutSpaces = newName.replace(/\s/g, ""); // Remove spaces
      $variables[index].name = newNameWithoutSpaces;
      $variables = [...$variables]; // Trigger reactivity
    }
  }
</script>

{#if errorMessage}
  <p class="error-message">Spaces not allowed in Name</p>
{/if}

<table class="">
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Value</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody class="text-black">
    {#each $variables as variable, index}
      <tr key={index}>
        <td
          ><input
            type="text"
            bind:value={variable.name}
            on:input={(e) => handleNameInput(e, index)}
            placeholder="Variable name"
          /></td
        >
        <td>
          <select bind:value={variable.type}>
            <option value="string">String</option>
            <option value="boolean">Boolean</option>
            <option value="number">Number</option>
          </select>
        </td>
        <td>
          {#if variable.type === "boolean"}
            <select bind:value={variable.value}>
              <option value={true}>true</option>
              <option value={false}>false</option>
            </select>
          {:else if variable.type === "number"}
            <input
              type="number"
              bind:value={variable.value}
              placeholder="Value"
            />
          {:else}
            <input
              type="text"
              bind:value={variable.value}
              placeholder="Value"
            />
          {/if}
        </td>
        <td>
          {#if $variables.length > 1}
            <button class="remove-btn" on:click={() => removeVariable(index)}
              >Remove</button
            >
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<button on:click={addVariable}>Add Variable</button>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  th,
  td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  button {
    margin-top: 1rem;
  }
  .remove-btn {
    background-color: red;
    color: white;
    border: none;
    padding: 0.3rem 0.6rem;
    border-radius: 0.3rem;
    cursor: pointer;
  }
  .error-message {
    color: red;
    margin-bottom: 0.5rem;
  }
</style>
