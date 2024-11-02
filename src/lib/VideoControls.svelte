<script lang="ts">
  import Player from "@vimeo/player";
  import { onMount } from "svelte";
  import {
    vimeoVideoObject,
    videoIsPlaying,
    videoIsLoading,
    isImmersive,
    isMuted,
    isMobile,
  } from "../store";
  import Button from "./Button.svelte";
  // play pause function
  function togglePlayPause() {
    if ($videoIsPlaying) {
      $vimeoVideoObject.pause();
    } else {
      $vimeoVideoObject.play();
    }
  }
  // creaet eventhandler for space to play pause the video
  function handleSpacePress(e: KeyboardEvent) {
    if (e.code === "Space") {
      e.preventDefault(); // Prevents default spacebar actions like scrolling
      togglePlayPause(); // Trigger togglePlayPause when space is pressed
    }
  }
  // Attach the event listener when the component mounts
  onMount(() => {
    window.addEventListener("keydown", handleSpacePress);

    // Clean up when the component is destroyed
    return () => {
      window.removeEventListener("keydown", handleSpacePress);
    };
  });
</script>

<div id="video-controls">
  {#if !$isImmersive}
    <Button on:click={togglePlayPause} title="Press Space to toggle">
      {#if $videoIsPlaying && !$videoIsLoading}
        {#if $isMobile === true}
          <img class="icon" src="/images/pause.svg" alt="Pause Button" />
        {:else}
          <div>
            Pause
            <img class="icon" src="/images/pause.svg" alt="Pause Button" />
          </div>
        {/if}
      {:else if $videoIsLoading}
        {#if $isMobile === true}
          <img class="icon" src="/images/loading.svg" alt="Loading Button" />
        {:else}
          <div>
            Loading
            <img class="icon" src="/images/loading.svg" alt="Loading Button" />
          </div>
        {/if}
      {:else if $isMobile === true}
        <img class="icon" src="/images/play.svg" alt="Play Button" />
      {:else}
        <div>
          Play
          <img class="icon" src="/images/play.svg" alt="Play Button" />
        </div>
      {/if}
    </Button>
  {/if}
  <Button
    on:click={() => {
      $isImmersive = !$isImmersive;
    }}
  >
    {#if $isImmersive === true}
      {#if $isMobile === true}
        <img
          class="icon"
          src="/images/immersive-close.svg"
          alt="Immersive Button"
        />
      {:else}
        <div>
          Immersive schliessen
          <img
            class="icon"
            src="/images/immersive-close.svg"
            alt="Immersive Button"
          />
        </div>
      {/if}
    {:else if $isMobile === true}
      <img
        class="icon"
        src="/images/immersive-open.svg"
        alt="Immersive Button"
      />
    {:else}
      <div>
        Immersive-Mode
        <img
          class="icon"
          src="/images/immersive-open.svg"
          alt="Immersive Button"
        />
      </div>
    {/if}
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

  #video-controls div {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }

  .icon {
    padding-top: 2px;
    height: 1em;
    width: 1em;
  }

  @media only screen and (max-width: 768px) {
    #video-controls {
      top: 0;
      right: 0;
      bottom: auto;
      left: auto;
    }
  }
</style>
