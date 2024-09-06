<script lang="ts">
  import { currentLine, currentTime } from "../store";
  import { hmsToSeconds } from "../utils/timeFormatter";
  import Circle from "./Circle.svelte";
</script>

<div id="station-list" class="view bottom-view">
  <ol>
    {#each $currentLine.timeStamps as station}
      <li><Circle isFilled={hmsToSeconds(station.endTime) < $currentTime} />{station.name}</li>
    {/each}
  </ol>
  <div id="stations-line"></div>
</div>

<style lang="scss">
  #station-list {
    --distance-to-left-edge: 0.5em;
    position: relative;
    max-height: calc(100vh - 24em);
    overflow: scroll;
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
