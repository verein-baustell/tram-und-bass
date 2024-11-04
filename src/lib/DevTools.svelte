<script>
  import { line } from "d3";
  import {
    currentStation,
    currentTime,
    devToolsState,
    nextStation,
    timeToSeekAfterVideoLoad,
    timeUntilNextStation,
    videoIsPlaying,
    videoIsLoading,
    vimeoVideoObject,
    previousStation,
    cookieConsent,
  } from "../store";
  import { giveConsent, revokeConsent } from "../utils/cookieManager";

  import Button from "./Button.svelte";
</script>

<div id="dev-tools">
  <h2>Dev Tools</h2>
  <Button
    on:click={() => {
      $vimeoVideoObject.setCurrentTime($timeUntilNextStation + $currentTime);
    }}
  >
    Jump to next station
  </Button>
  <Button
    on:click={() => {
      devToolsState.update((state) => ({
        ...state,
        showAllUnreleasedLines: !state.showAllUnreleasedLines,
      }));
    }}
    >{$devToolsState.showAllUnreleasedLines
      ? "Hide unreleased"
      : "Show unreleased"}</Button
  >
  <Button
    on:click={() => {
      giveConsent();
    }}
  >
    Give consent
  </Button>
  <Button
    on:click={() => {
      revokeConsent();
    }}
  >
    Revoke consent
  </Button>
  <table>
    <tr> <td> currentTime:</td><td> {$currentTime.toFixed(2)}</td></tr>
    <tr> <td> videoIsPlaying:</td><td> {$videoIsPlaying}</td></tr>
    <tr> <td> videoIsLoading:</td><td> {$videoIsLoading}</td></tr>
    <tr> <td> cookieConsent:</td><td> {$cookieConsent}</td></tr>
    <tr>
      <td> timeToSeekAfterVideoLoad:</td><td>
        {$timeToSeekAfterVideoLoad}</td
      ><td></td></tr
    >
  </table>
  <table>
    <tr> <td> currentStation:</td><td> {$currentStation?.name}</td></tr>
    <tr> <td> previousStation:</td><td> {$previousStation?.name}</td></tr>
    <tr> <td> nextStation:</td><td> {$nextStation?.name}</td></tr>
    <tr>
      <td> timeUntilNextStation:</td><td>
        {$timeUntilNextStation.toFixed(2)}</td
      ></tr
    >
  </table>
</div>

<style lang="scss">
  #dev-tools {
    font-family: monospace;
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    align-items: center;
    top: 0;
    right: 0;
    background: transparent;
    backdrop-filter: invert(1);
    padding: 0.5em 1em;
    border-radius: 0.5em;
    z-index: 1000;
    h2 {
      color: white;
    }
    table {
      width: 100%;
      font-size: 0.75em;
      color: white;
      background-color: rgba(25, 25, 25, 0.728);
      border-radius: 0.25em;
    }
  }
</style>
