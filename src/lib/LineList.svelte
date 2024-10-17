<script lang="ts">
  import LineListItem from "./LineListItem.svelte";
  export let lines: Line[];
  export let viewable = true;
  export let onClick: (lineClicked: Line) => void;
  import '../style/style.css'
  console.log(lines);
  
</script>
<div class="{(viewable ? 'view detailed-view': '')}">
  <ul>
    {#each lines as line}
      <LineListItem
        {onClick}
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
</style>
