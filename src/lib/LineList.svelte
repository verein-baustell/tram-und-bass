<script lang="ts">
  import { currentLine } from "../store";
  import LineListItem from "./LineListItem.svelte";

  export let lines: Line[];
</script>

<ul>
  {#each lines as line}
    <LineListItem line={line} />
   
  {/each}
</ul>
<style lang="scss" scoped>
  // reset ul li
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

</style>