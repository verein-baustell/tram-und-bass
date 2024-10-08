<script lang="ts">
  import Vimeo from "@vimeo/player";
  import { onMount } from "svelte";
  import TopMenu from "$lib/TopMenu.svelte";
  import VideoControls from "$lib/VideoControls.svelte";
  import BottomMenu from "$lib/BottomMenu.svelte";
  import LandingScreen from "$lib/LandingScreen.svelte";
  import {
    currentLine,
    isImmersive,
    videoIsPlaying,
    vimeoVideoObject,
    allLines,
  } from "../store";
  import DevTools from "$lib/DevTools.svelte";
  import registerVimeoEventListeners from "../utils/registerVimeoEventListeners";
  import SplashScreen from "$lib/SplashScreen.svelte";
  import LoadingScreen from "$lib/LoadingScreen.svelte";
  import { attributes as aboutContent } from "../content/about.md";
  // console.log(aboutContent)
  let videoWrapperWidth = "100%";
  let videoWrapperHeight = "100%";
  let isDevMode = false;
  let showSplashScreen = true;
  // TODO: Want it to maybe pick a random line?
  $currentLine = $allLines[0];

  const today = new Date();
  const releaseDate = new Date("2024-01-01T22:00:00");
  const showLandingPage = today <= releaseDate;
  onMount(() => {
    if (showLandingPage) return;
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

{#if showLandingPage}
  <LandingScreen />
{:else}
  <div
    id="video-container"
    class={$videoIsPlaying ? "" : "isLoading"}
    style={`width: ${videoWrapperWidth}; height: ${videoWrapperHeight};`}
  ></div>
  {#if showSplashScreen}
    <SplashScreen onClick={() => (showSplashScreen = false)} />
  {/if}
  {#if !$videoIsPlaying}
    <LoadingScreen 

    style={`width: ${videoWrapperWidth}; height: ${videoWrapperHeight};`}
    />
  {/if}
  <VideoControls />
  {#if isDevMode}
    <DevTools />{/if}
  {#if !$isImmersive}
    <TopMenu aboutContent={aboutContent?.aboutText ??""} />
    <BottomMenu />
  {/if}
{/if}

<style lang="scss">
  :root {
    @font-face {
      font-family: Rene;
      font-style: normal;
      font-weight: 400;
      src: url("/fonts/Rene-Regular-Web.woff") format("woff");
    }

    // fix: font has changed
    @font-face {
      font-family: Holo;
      font-style: normal;
      font-weight: 500;
      src: url("/fonts/NaNHoloNarrow-Regular.woff2") format("woff2");
    }

    // fixzed up we don't us this font, code is single source of truth
    //@font-face {
    //  font-family: Holo;
    //  font-style: normal;
    //  font-weight: 500;
    //  src: url("/fonts/NaNHolo-Medium.woff2") format("woff2");
    //}
    // @font-face {
    //   font-family: Holo;
    //   font-style: medium;
    //   font-weight: 600;
    //   src: url("/fonts/NaNHolo-Medium.woff2") format("woff2");
    // }
    @font-face {
      font-family: HoloMono;
      font-style: normal;
      font-weight: 500;
      src: url("/fonts/NaNHoloMono-Medium.woff2") format("woff2");
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
    --padding-ml: 0.05em 0.5em 0.24em 0.48em;
    --padding-l: 0.48em;
    --mobile-breakpoint: 600px;
    --padding-s: 0.12em;
    $mobile-breakpoint: 600px;
  }
  #video-container {
    transition: filter 0.5s ease-in-out;
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
    z-index: -200;
  }
</style>
