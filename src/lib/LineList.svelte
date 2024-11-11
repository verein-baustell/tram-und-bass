<script lang="ts">
  import LineListItem from "./LineListItem.svelte";
  export let lines: Line[];
  export let viewable = true;
  export let id: string | undefined = undefined;
  export let onClick: (lineClicked: Line) => void;
  export let isClosable = false;
  export let onClose: (() => void) | undefined = undefined;
  export let title: string | undefined | null = undefined;
  import "../style/style.css";
  import { lastState, lastStateRecovered, isBtmOpen } from "../store";
  import { changeToLineAtTime } from "../utils/changeToLineAtCurrentTime";
  import LineNumber from "./LineNumber.svelte";
  import Button from "./Button.svelte";

  export let hasRecoveryButton: boolean = true;

  const goToLastState = () => {
    lastStateRecovered.set(true);
    changeToLineAtTime($lastState.line, $lastState.time);
  };
  
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60); // Use Math.floor to remove decimals
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  let formattedTime = formatTime($lastState.time);
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
    <p>Wieder einsteigen </p>
    <Button
      style="height: 1.75em; margin-bottom: 0.8em"
      class="recovery isInverted-{$lastState.line?.isInverted} {$lastState.line?.number === 7 ? 'isSeven' : ''}"
      on:click={() => {
        goToLastState();
      }}>
      {$lastState.line?.name} at <span class="mono-font clock">{formattedTime}</span>
    </Button>
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

  .clock {
    border: thin solid white;
    border-radius: 3px;
    padding: 0.03em 0.35em 0.1em 0.35em;
  }

  .numb {
    margin-left: var(--padding-l);
    margin-right: var(--padding-l);
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
  .nav-element {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    border-radius: var(--border-radius-view);
  }
</style>
