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
  import { lastState, lastStateRecovered, isBtmOpen } from "../store";
  import { changeToLineAtTime } from "../utils/changeToLineAtCurrentTime";

  export let hasRecoveryButton: boolean = true;

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

  {#if $lastState.line && !$lastStateRecovered && !$isBtmOpen && hasRecoveryButton}
    <ul>
      <button
        class:isInverted={$lastState.line.isInverted}
        class="recovery"
        style="background-color: {$lastState.line.color};"
        on:click={() => {
          goToLastState();
        }}>Wieder in das Tram {$lastState.line?.number} einsteigen</button
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
  .line-list {
    overflow-y: scroll;
    overflow-x: hidden;
  }
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
    overflow: hidden;
  }

  .isInverted {
    color: black !important;
  }
  button.recovery {
    position: relative;
    background-color: var(--background-color);
    border: none;
    color: white;
    cursor: pointer;
    width: 100%;
    padding: var(--padding-m);
    border-radius: var(--border-radius-button);
    align-items: center;
    gap: 0.5em;
    transition: var(--transition);
    line-height: 1.75em;
  }
</style>
