<script>
  import {
    currentTime,
    timeUntilNextStation,
    vimeoVideoObject,
  } from "../store";

  import Button from "./Button.svelte";
</script>

<div id="dev-tools">
  Dev Tools
  <Button
    on:click={() => {
      $vimeoVideoObject.setCurrentTime($timeUntilNextStation + $currentTime);
    }}
  >
    Jump to next station
  </Button>
</div>

<style lang="scss">
  #dev-tools {
    font-family: monospace;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 0;
    right: 0;
    background: transparent;
    backdrop-filter: invert(1);
    padding: .5em 1em;
    border-radius: 0.5em;
    z-index: 1000;
  }
</style>
