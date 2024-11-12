<script lang="ts">
  import { history } from "../store";
  import { onMount } from "svelte";
  import { clearState } from "../utils/stateManager";
  import { slide } from "svelte/transition"; // Import the slide transition
  import { fade } from "svelte/transition"; // Import the fade transition
  import HistoryListItem from "./HistoryListItem.svelte";

  let showHistory = false; // Controls the visibility of the history list

  // Function to toggle history visibility
  function toggleHistory() {
    showHistory = !showHistory;
  }
</script>

<div class="history">
  <div class="header">
    <button on:click={toggleHistory} class="buttons">
      <p>Zeitplan</p>
      <div class="controlls">
        <img
          src={showHistory ? "/images/close.svg" : "/images/open.svg"}
          alt={showHistory ? "Close History" : "Open History"}
          class="icon"
        />
      </div>
    </button>
  </div>

  {#if showHistory}
    <div class="content" transition:slide={{ duration: 300, axis: "y" }}>
      <ul>
        {#each $history.slice(0, 5) as element, index}
          <HistoryListItem state={element} {index}></HistoryListItem>
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
    /* background: black; */
    /* border-radius: var(--border-radius-view); */
    padding: 0.1em;
    /* margin-bottom: 5px; */
    overflow: hidden;
    color: black;
  }
  .content {
    background: black;
    border-radius: var(--border-radius-view);
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
    justify-content: flex-end;
  }
  .buttons {
    display: flex;
    gap: 0.1em;
    border: none;
    background: none;
    padding: 0 5px 0 0;
  }
  .recovery {
    width: 100%;
  }
  .icon {
    width: 14px;
    padding-top: 3px;
    margin-left: 5px;
  }
  p {
    color: black;
  }
</style>
