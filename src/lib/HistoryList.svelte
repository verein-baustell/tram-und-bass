<script lang="ts">
  import { history, isTopOpen } from "../store";
  import { onMount } from "svelte";
  import { changeToLineAtTime } from "../utils/changeToLineAtCurrentTime";
  import { recoverState, clearState } from "../utils/stateManager";
  import { slide } from "svelte/transition"; // Import the slide transition
  import { fade } from "svelte/transition"; // Import the fade transition

  let showHistory = false; // Controls the visibility of the history list

  // Function to toggle history visibility
  function toggleHistory() {
    showHistory = !showHistory;
  }

  // Time formatting function
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
</script>

<div class="history">
  <div class="header">
    <h4>History</h4>
    <div class="buttons">
      {#if showHistory}
        <button
          class="controlls"
          on:click={clearState}
          transition:fade={{ duration: 100 }}>Clear</button
        >
      {/if}
      <button class="controlls" on:click={toggleHistory}>
        <img
          src={showHistory ? "/images/close.svg" : "/images/open.svg"}
          alt={showHistory ? "Close History" : "Open History"}
          class="icon"
        />
      </button>
    </div>
  </div>

  {#if showHistory}
    <div class="content" transition:slide={{ duration: 300, axis: "y" }}>
      <ul>
        {#each $history.slice(0, 5) as element, index}
          <button
            style="background-color: {element.line?.color};"
            class="recovery isInverted-{element.line?.isInverted} {element.line
              ?.number === 7
              ? 'isSeven'
              : ''}"
            on:click={() => {
              const newState = recoverState(index);
              if (newState) {
                changeToLineAtTime(newState.line, newState.time);
                isTopOpen.set(false);
              }
            }}
          >
            {element.line?.name} at
            <span class="mono-font clock">{formatTime(element.time)}</span>
          </button>
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  h4 {
    padding-left: 5px;
  }
  .history {
    background: var(--background-color-light);
    border-radius: var(--border-radius-view);
    padding: 0.1em;
    margin-bottom: 5px;
  }
  .controlls {
    background-color: white;
    color: black;
    border: none;
    border-radius: var(--border-radius-button);
    cursor: pointer;
    margin: 0.12em 0.12em 0.12em 0em;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    height: 20px;
    width: auto;
    font-size: 10px;
    transition: var(--transition);
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .buttons {
    display: flex;
    gap: 0.1em;
  }
  .recovery {
    width: 100%;
  }
  .icon {
    width: 10px;
  }
  .content {
    margin-top: 5px;
  }
</style>
