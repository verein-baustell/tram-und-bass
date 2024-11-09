<script lang="ts">
  import {
    currentLine,
    currentStation,
    isWider,
    previousStation,
    vimeoVideoObject,
  } from "../store";
  import { hmsToSeconds } from "../utils/timeFormatter";
  import Circle from "./Circle.svelte";

  $: stationProgressIndex = $currentLine?.timeStamps?.findIndex(
    (station) =>
      station.name === ($currentStation?.name ?? $previousStation?.name)
  );
</script>

<div
  id="station-list"
  class="view detailed-view {!$isWider ? 'detailed-view--right' : ''}"
>
  {#if $currentLine?.timeStamps}
    <ol>
      <div class="progress-line" />
      <div
        class="progress-line line-fill"
        style={`height: ${(stationProgressIndex ?? 0) * 32}px`}
      />
      {#each $currentLine.timeStamps as station, index}
        <li
          class={$currentStation && $currentStation.name === station.name
            ? "active"
            : ""}
        >
          <button
            on:click={() =>
              $vimeoVideoObject.setCurrentTime(hmsToSeconds(station.startTime))}
          >
            <Circle
              isFilled={stationProgressIndex !== undefined &&
                !($currentStation?.name === station.name) &&
                index <= stationProgressIndex}
            />
            {station.name}
          </button>
        </li>
      {/each}
    </ol>
  {:else}
    <div class="error-message">keine Stationen gefunden :(</div>
  {/if}
</div>

<style lang="scss" scoped>
  .error-message {
    display: grid;
    place-items: center;
  }

  .progress-line {
    height: calc(100% - 2em);
    width: 1px;
    position: absolute;
    left: 0.75em;
    transform: translate(-50%, 0);
    top: 1em;
    bottom: 1em;
    background: currentColor;
  }
  .line-fill {
    width: 2px;
    transition: height 0.3s ease-in-out;
  }
  #station-list {
    --distance-to-left-edge: 0.5em;
    overflow-y: scroll;
    overflow-x: hidden;
    background: var(--background-color);
  }
  :global(li.active) {
    font-weight: bold;
    :global(.circle) {
      outline: 2px solid var(--foreground-color);
    }
  }
  ol {
    position: relative;
  }
  li {
    padding: 0em var(--distance-to-left-edge);
    button {
      // reset button styles
      border: none;
      background: none;
      padding: 0;
      display: flex;
      align-items: center;
      gap: 0.5em;
      height: 32px;
      cursor: pointer;
      &:hover {
        font-weight: bold;
        :global(.circle) {
          scale: 1.5;
        }
      }
    }
  }
</style>
