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
  import SplashScreen from "$lib/SplashScreen.svelte";
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
<div class="blur-vignette"></div>
{#if !$videoIsPlaying}
  <SplashScreen />{/if}
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
      src: url("/fonts/Rene-Regular-Web.woff") format("woff");
    }
    @font-face {
      font-family: Holo;
      font-style: normal;
      font-weight: 500;
      src: url("/fonts/NaNHoloNarrow_TRIAL-Regular.woff2") format("woff2");
    }
    @font-face {
      font-family: HoloMono;
      font-style: normal;
      font-weight: 500;
      src: url("/fonts/NaNHoloMono_TRIAL-Medium.woff2") format("woff2");
    }

    --background-color: rgb(255, 255, 255);
    --foreground-color: black;
    --background-color-light: #eeeeee;
    --hover-color: #dddddd;
    --border-radius-button: 0.4em;
    --border-radius-view: 0.52em;
    --padding-view: 0.5em 0.8em;
    --font-size: 1em;
    --global-padding: 0.8em;
    --transition: ease-in-out 0.3s;
    --padding-m: 0.24em;
    --padding-s: 0.12em;
  }
  #video-container {
    filter: saturate(1.5);
    transition: filter 1s ease-in-out;
    &.isLoading {
      filter: blur(24px);
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

  .blur-vignette {
    --radius: 0px;
    --inset: 32px;
    --transition-length: 128px;
    --blur: 32px;

    position: absolute;
    inset: 0;
    border-radius: var(--radius);
    -webkit-backdrop-filter: blur(var(--blur));
    backdrop-filter: blur(var(--blur));
    --r: max(var(--transition-length), calc(var(--radius) - var(--inset)));
    --corner-size: calc(var(--r) + var(--inset)) calc(var(--r) + var(--inset));
    --corner-gradient: transparent 0px,
      transparent calc(var(--r) - var(--transition-length)), black var(--r);
    --fill-gradient: black, black var(--inset),
      transparent calc(var(--inset) + var(--transition-length)),
      transparent calc(100% - var(--transition-length) - var(--inset)),
      black calc(100% - var(--inset));
    --fill-narrow-size: calc(100% - (var(--inset) + var(--r)) * 2);
    --fill-farther-position: calc(var(--inset) + var(--r));
    -webkit-mask-image: linear-gradient(to right, var(--fill-gradient)),
      linear-gradient(to bottom, var(--fill-gradient)),
      radial-gradient(at bottom right, var(--corner-gradient)),
      radial-gradient(at bottom left, var(--corner-gradient)),
      radial-gradient(at top left, var(--corner-gradient)),
      radial-gradient(at top right, var(--corner-gradient));
    -webkit-mask-size:
      100% var(--fill-narrow-size),
      var(--fill-narrow-size) 100%,
      var(--corner-size),
      var(--corner-size),
      var(--corner-size),
      var(--corner-size);
    -webkit-mask-position:
      0 var(--fill-farther-position),
      var(--fill-farther-position) 0,
      0 0,
      100% 0,
      100% 100%,
      0 100%;
    -webkit-mask-repeat: no-repeat;
  }
</style>
