<script>
  import {
    currentStation,
    currentTime,
    nextStation,
    timeToSeekAfterVideoLoad,
    timeUntilNextStation,
    videoIsPlaying,
    vimeoVideoObject,
  } from "../store";

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
  <table>
    <tr> <td> currentTime:</td><td> {$currentTime.toFixed(2)}</td></tr>
    <tr> <td> videoIsPlaying:</td><td> {$videoIsPlaying}</td></tr>
    <tr>
      <td> timeToSeekAfterVideoLoad:</td><td>
        {$timeToSeekAfterVideoLoad}</td
      ><td></td></tr
    >
  </table>
  <table>
    <tr> <td> currentStation:</td><td> {$currentStation?.name}</td></tr>
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
