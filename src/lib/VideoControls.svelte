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
  {#if !$isImmersive}
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
  {/if}
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
    z-index: 1;
    position: fixed;
    bottom: 0;
    left: 0;
    margin: var(--global-padding);
    display: flex;
    background: var(--background-color-light);
    border-radius: var(--border-radius-view);
  }
</style>
