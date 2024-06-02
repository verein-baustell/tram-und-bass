<script lang="ts">
  import {
    vimeoVideoObject,
    videoIsPlaying,
    isImmersive,
    isMuted,
  } from "../store";
  import Button from "./Button.svelte";
</script>

<div id="video-controls">
  <Button
    on:click={() => {
      if ($videoIsPlaying) {
        $vimeoVideoObject.pause();
      } else {
        $vimeoVideoObject.play();
      }
    }}
  >
    {#if $videoIsPlaying}
      Pause
    {:else}
      Play
    {/if}
  </Button>
  <Button
    on:click={() => {
      $vimeoVideoObject.setMuted(!$isMuted);
    }}
  >
    {#if $isMuted}
      Unmute
    {:else}
      Mute
    {/if}
  </Button>
  <Button
    on:click={() => {
      $isImmersive = !$isImmersive;
    }}
  >
    Toggle Immersive
  </Button>
</div>

<style scoped>
  #video-controls {
    position: absolute;
    bottom: 1em;
    left: 1em;
    display: flex;
  }
</style>
