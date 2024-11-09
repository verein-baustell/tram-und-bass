<script lang="ts">
  import LineListItem from "./LineListItem.svelte";
  export let lines: Line[];
  export let viewable = true;
  export let id: string | undefined = undefined;
  export let onClick: (lineClicked: Line) => void;
  export let isClosable = false;
  export let onClose: (() => void) | undefined = undefined;
  export let title: string | undefined = undefined;
  import "../style/style.css";
  import { lastState, lastStateRecovered } from "../store";
  import { changeToLineAtTime } from "../utils/changeToLineAtCurrentTime";

  const goToLastState = () => {
    lastStateRecovered.set(true);
    changeToLineAtTime($lastState.line, $lastState.time);
  };
</script>

<div {id} class={"line-list " + (viewable ? "view detailed-view" : "")}>
  {#if title}
    <h4>
      {title}{#if isClosable}
        <button class="close-button" on:click={onClose}>
          <img class="close" src="/images/close.svg" alt="-" />
        </button>
      {/if}
    </h4>
  {/if}

  {#if $lastState.line && !$lastStateRecovered}
    <ul>
      <button
        style="margin: 5px; width: calc(100% - 10px);"
        on:click={() => {
          goToLastState();
        }}>Wieder einsteigen in die Tram {$lastState.line?.number}</button
      >
    </ul>
  {/if}

  <ul>
    {#each lines as line}
      <LineListItem {onClick} {line} />
    {/each}
  </ul>
</div>

<style lang="scss" scoped>
  h4 {
    font-size: 1.5em;
    margin: 0;
    margin-bottom: 4px;
    font-weight: bold;
    text-align: center;
    top: 0;
    z-index: 1;
    background-color: var(--background-color);
    padding: 0 1.2em;
    position: relative;
  }
  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    background-color: transparent;
    border: none;
    color: inherit;
    font-size: 1em;
    padding: 0 0.3em;
    cursor: pointer;
    display: flex;
    height: 2em;
  }

  .close {
    height: 1em;
    width: 1em;
  }
  // reset ul li
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
</style>
