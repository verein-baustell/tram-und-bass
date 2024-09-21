<script lang="ts">
  import LineListItem from "./LineListItem.svelte";

  export let lines: Line[];
  export let keepStationWhenChangingLine = false;
</script>
<div class="view detailed-view">
  <ul>
    {#each lines as line}
      <LineListItem
        {keepStationWhenChangingLine}
        {line}
      />
    {/each}
  </ul>
</div>

<style lang="scss" scoped>
  // reset ul li
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  #line-list{
    max-height: calc(100vh - 24em);
    overflow: scroll;
  }
</style>
