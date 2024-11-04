<script lang="ts">
  import LineListItem from "./LineListItem.svelte";
  export let lines: Line[];
  export let viewable = true;
  export let id: string;
  export let onClick: (lineClicked: Line) => void;
  export let isClosable = false;
  export let onClose: (() => void) | undefined = undefined;
  export let title: string | undefined = undefined;
  import '../style/style.css'
</script>
<div id={id} class="{("line-list " + (viewable ? 'view detailed-view': ''))}">
  {#if title}
    <h4>{title}</h4>
  {/if}
  {#if isClosable}
    <button class="close-button" on:click={onClose}>X</button>
  {/if}
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
  h4{
    font-size: 1.5em;
    margin: 0;
    font-weight: bold;
    text-align: center;

  }
  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    background-color: transparent;
    border: none;
    color: inherit;
    font-size: 1em;
    z-index: 1;
    cursor: pointer;
  }
  // reset ul li
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
</style>
