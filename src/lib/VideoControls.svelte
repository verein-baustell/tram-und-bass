<script lang="ts">
  import {
    vimeoVideoObject,
    videoIsPlaying,
    isImmersive,
    isMuted,
    isMobile,
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
  @media only screen and (max-width: 768px) {
  #video-controls{
    top: 0;
    right: 0;
    bottom: auto;
    left: auto;
  }
}

</style>
