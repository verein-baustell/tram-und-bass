<script lang="ts">
  import Vimeo from "@vimeo/player";
  import { onMount } from "svelte";
  import TopMenu from "$lib/TopMenu.svelte";
  import VideoControls from "$lib/VideoControls.svelte";
  import BottomMenu from "$lib/BottomMenu.svelte";
  import {
    currentLine,
    isImmersive,
    isMuted,
    videoIsPlaying,
    vimeoVideoObject,
    allLines,
    currentTime,
  } from "../store";
  import DevTools from "$lib/DevTools.svelte";
  import registerVimeoEventListeners from "../utils/registerVimeoEventListeners";
  let videoWrapperWidth = "100%";
  let videoWrapperHeight = "100%";
  let isDevMode = false;
  // TODO: Want it to maybe pick a random line?
  $currentLine = $allLines[0];
  onMount(() => {
    isDevMode =
      window.location.hostname === "localhost" ||
      localStorage.getItem("devMode") === "true";
    // @ts-ignore
    window.devMode = () => {
      isDevMode = true;
      localStorage.setItem("devMode", "true");
    };
    // @ts-ignore
    window.disableDevMode = () => {
      isDevMode = false;
      localStorage.setItem("devMode", "false");
    };
    $vimeoVideoObject = new Vimeo("video-container", {
      url: $currentLine.videoUrl,
      controls: false,
      autopause: false,
      loop: true,
    });
    registerVimeoEventListeners();
    const adjustDimensionsOfVideoWrapper = () => {
      if (window.innerHeight > (window.innerWidth * 9) / 16) {
        videoWrapperWidth = "auto";
        videoWrapperHeight = "100%";
      } else {
        videoWrapperWidth = "100%";
        videoWrapperHeight = "auto";
      }
    };
    adjustDimensionsOfVideoWrapper();
    // register on resize
    window.addEventListener("resize", adjustDimensionsOfVideoWrapper);
  });
</script>

<div
  id="video-container"
  class={$videoIsPlaying ? "" : "isLoading"}
  style={`width: ${videoWrapperWidth}; height: ${videoWrapperHeight};`}
></div>
<VideoControls />
{#if isDevMode}
  <DevTools />{/if}
{#if !$isImmersive}
  <TopMenu aboutContent={"aboutContent"} />
  <BottomMenu />
{/if}

<style lang="scss">
  :root {
    @font-face {
      font-family: Rene;
      font-style: normal;
      font-weight: 400;
      src:
        url("/fonts/Rene-Regular-Web.woff") format("woff");
    }
    @font-face {
      font-family: Holo;
      font-style: normal;
      font-weight: 500;
      src:
        url("/fonts/NaNHolo_TRIAL-Medium.woff2") format("woff2");
    }
    @font-face {
      font-family: HoloMono;
      font-style: normal;
      font-weight: 500;
      src:
        url("/fonts/NaNHoloMono_TRIAL-Medium.woff2") format("woff2");
    }

    --background-color: rgb(255, 255, 255);
    --foreground-color: black;
    --border-radius: 0.5em;
  }
  #video-container {
    transition: filter 0.5s ease-in-out;
    &.isLoading {
      filter: blur(10px);
    }
    position: absolute;
    aspect-ratio: 16 / 9;
    pointer-events: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    z-index: -1;
  }
</style>
