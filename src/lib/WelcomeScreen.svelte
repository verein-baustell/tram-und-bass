<script lang="ts">
  import LineList from "./LineList.svelte";
  import { onMount } from "svelte";
  import Button from "./Button.svelte";
  import { clickoutside } from "@svelte-put/clickoutside";
  import { 
    vimeoVideoObject,
    videoIsPlaying,
    onHome,
    currentLine
  } from "../store";

  function togglePlayPause() {
    if ($videoIsPlaying) {
      $vimeoVideoObject.play();
    } else {
      $vimeoVideoObject.pause();
      currentLine.set($currentLine)
      onHome.set(false)
    }
  }
</script>

<div id="welcome-screen">
  <div class="landing--container">
    <h1>Willkommen bei Tram und Bass</h1>
    <div>
      Cookie consent here
    </div>
    <Button 
      on:click={togglePlayPause} 
      title="Press Space to toggle"
    >
      Einsteigen!
    </Button>
  </div>
</div>

<style lang="scss" scoped>
  #welcome-screen {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .landing--container {
    position: absolute;
    display: flex;
    flex-flow: column wrap;
    text-align: center;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30%;
    height: 300px;
    background-color: white;
    border-radius: var(--border-radius-view);
  }
</style>
