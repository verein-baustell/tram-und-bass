<script lang="ts">
  import { currentLine } from "../store";
  import Circle from "./Circle.svelte";
</script>

<div id="station-list">
  <ol>
    {#each $currentLine.timeStamps as station}
      <li><Circle />{station.name}</li>
    {/each}
  </ol>
  <div id="stations-line"></div>
</div>

<style lang="scss">
  #station-list {
    --distance-to-left-edge: 0.5em;
    position: relative;
    #stations-line {
      position: absolute;
      top: 0;
      left: calc(var(--distance-to-left-edge) + 0.25em);
      width: 1px;
      height: 100%;
      background: var(--foreground-color);
      transform: translate(-50%, 0);
    }
    background: var(--background-color);
    ol {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    li {
      padding: 0em var(--distance-to-left-edge);
      border-radius: 0.5em;
      display: flex;
      align-items: center;
      gap: 0.5em;
    }
  }
</style>
