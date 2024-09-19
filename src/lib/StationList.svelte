<script lang="ts">
  import { currentLine, currentTime } from "../store";
  import { hmsToSeconds } from "../utils/timeFormatter";
  import Circle from "./Circle.svelte";
</script>

<div id="station-list" class="view bottom-view">
  <ol>
    {#each $currentLine.timeStamps as station, index}
      <li>
        <Circle noLine={index === $currentLine.timeStamps.length - 1} isFilled={hmsToSeconds(station.endTime) < $currentTime} />
        {station.name}
      </li>
    {/each}
  </ol>
</div>

<style lang="scss">
  #station-list {
    --distance-to-left-edge: 0.5em;
    position: relative;
    max-height: calc(100vh - 24em);
    overflow: scroll;
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
      height: 32px;
    }
  }
</style>
