<script lang="ts">
  import { currentLine, currentStation, vimeoVideoObject } from "../store";
  import { changeToLineAtCurrentStation } from "../utils/changeToLineAtCurrentStation";
  import { hmsToSeconds } from "../utils/timeFormatter";
  import LineNumber from "./LineNumber.svelte";

  export let keepStationWhenChangingLine = false;
  export let line: Line;
</script>

<li>
  <button
    on:click={() => {
      if (keepStationWhenChangingLine) {
        changeToLineAtCurrentStation(line);
        return;
      }
      $currentLine = line;
    }}
    on:keydown={(e) => {
      if (e.key === "Enter") {
        $currentLine = line;
      }
    }}
    class:isActive={$currentLine === line}
  >
    <LineNumber number={line.number}/>
    <span>{line.name}</span>
    <!-- TODO: Add Icon -->
    -
    <span>{line.artistName}</span>
  </button>
</li>

<style lang="scss" scoped>
  button {
    // TODO: Do the colors with variables
    &.isActive {
      filter: invert(1);
    }
    // reset button
    background-color: var(--background-color);
    border: none;
    cursor: pointer;
    display: flex;
    width: 100%;
    padding: var(--padding-m);
    border-radius: var(--border-radius-button);
    align-items: center;
    gap: 0.5em;
    transition: var(--transition);
  }

  button:hover{
    background-color: var(--hover-color);
    transition: var(--transition);
  }
</style>
