<script lang="ts">
  import { currentLine, currentTime, isWider } from "../store";
  import { hmsToSeconds } from "../utils/timeFormatter";
  import Circle from "./Circle.svelte";
</script>

<div id="station-list" class="view detailed-view {!$isWider ? 'detailed-view--right': ''}">
  {#if $currentLine.timeStamps}
    <ol>
      {#each $currentLine.timeStamps as station, index}
        <li>
          <Circle
            noLine={index === $currentLine.timeStamps.length - 1}
            isFilled={hmsToSeconds(station.endTime) < $currentTime}
          />
          {station.name}
        </li>
      {/each}
    </ol>
  {:else}
    <div class="error-message">keine Stationen gefunden :( </div>
  {/if}
</div>

<style lang="scss">
  .error-message {
    display: grid;
    place-items: center;
  }
  #station-list {
    --distance-to-left-edge: 0.5em;
    overflow: scroll;
    background: var(--background-color);
  }
  li {
    padding: 0em var(--distance-to-left-edge);
    border-radius: 0.5em;
    display: flex;
    align-items: center;
    gap: 0.5em;
    height: 32px;
}
</style>
