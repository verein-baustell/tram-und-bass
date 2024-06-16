<script lang="ts">
  import LineListItem from "./LineListItem.svelte";

  export let lines: Line[];
  export let keepStationWhenChangingLine = false;
</script>

<ul>
  {#each lines as line}
    <LineListItem
      {keepStationWhenChangingLine}
      {line}
    />
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
