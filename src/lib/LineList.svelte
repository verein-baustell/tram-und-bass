<script lang="ts">
  import { currentLine } from "../store";

  export let lines: Line[];
</script>

<ul>
  {#each lines as line}
    <button
      on:click={() => {
        $currentLine = line;
      }}
    >
      {line.name}
    </button>
  {/each}
</ul>
