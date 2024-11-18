<script lang="ts">
  import Vimeo from "@vimeo/player";
  import { onMount } from "svelte";
  import TopMenu from "$lib/TopMenu.svelte";
  import VideoControls from "$lib/VideoControls.svelte";
  import BottomMenu from "$lib/BottomMenu.svelte";
  import LandingScreen from "$lib/LandingScreen.svelte";
  import WelcomeScreen from "$lib/WelcomeScreen.svelte";
  import { initFinalState, recoverState } from "../utils/stateManager";
  import { changeToLineAtTime } from "../utils/changeToLineAtCurrentTime";
  import {
    currentLine,
    isImmersive,
    videoIsPlaying,
    videoIsLoading,
    vimeoVideoObject,
    allLines,
    devToolsState,
    isMobile,
    currentTime,
    timeUntilNextStation,
    previousStation,
    nextStation,
    cookieConsent,
  } from "../store";
  import DevTools from "$lib/DevTools.svelte";
  import registerVimeoEventListeners from "../utils/registerVimeoEventListeners";
  import SplashScreen from "$lib/SplashScreen.svelte";
  import LoadingScreen from "$lib/LoadingScreen.svelte";
  import { attributes as aboutContent } from "../content/about.md";
  import compareStationNames from "../utils/compareStationNames";
  import { goto } from "$app/navigation";
  import { hmsToSeconds } from "../utils/timeFormatter";
  import consoleInit from "../utils/consoleInit";
  let videoWrapperWidth = "100%";
  let videoWrapperHeight = "100%";
  let videoWidth = 0;
  let videoHeight = 0;
  let extraWidth = 0;
  let isDevMode = false;
  let showSplashScreen = true;
  const releasedLines = $allLines.filter((line) => line.isReleased);
  let randomIndex = Math.floor(Math.random() * (releasedLines.length - 1));
  let tempLine = releasedLines[randomIndex];
  const initVideo = () => {
    readLineFromPath();
    if (!$currentLine || !$currentLine.videoUrl) {
      console.log("no current line");
      return;
    }
    $vimeoVideoObject = new Vimeo("video-container", {
      url: $currentLine.videoUrl,
      controls: false,
      autopause: false,
      loop: false,
    });
    registerVimeoEventListeners();
  };

  $: if ($cookieConsent) {
    initVideo();
  }

  // Set `initialized` to true after `cookieConsent` is set
  import { browser } from "$app/environment";
  let initialized = false;
  if (browser) {
    cookieConsent.subscribe(() => {
      initialized = true;
    });
  }

  const readLineFromPath = () => {
    // leave line parameter in url if no cookie is set
    const url = new URL(window.location.href);
    const lineIdFromUrl = url.searchParams.get("line");
    if (lineIdFromUrl) {
      const lineFromUrl = $allLines.find((line) =>
        compareStationNames(line.id, lineIdFromUrl)
      );
      if (lineFromUrl && lineFromUrl.isReleased) {
        // set the line
        tempLine = lineFromUrl;
        if (!$cookieConsent) {
          tempLine = lineFromUrl;
          return;
        } else {
          $currentLine = lineFromUrl;
        }
      } else {
        console.log("line in url not released or not existant");
        url.searchParams.delete("line");
        goto(url.toString(), { replaceState: true });
      }
    } else {
      if (!$cookieConsent) {
        return;
      } else {
        $currentLine = tempLine;
      }
    }
  };

  const today = new Date();
  const releaseDate = new Date("2024-01-01T22:00:00");
  const showLandingPage = today <= releaseDate;
  onMount(() => {
    consoleInit();
    initFinalState();
    readLineFromPath();

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
    // Reactive statement to run the initVideo function when cookieConsent becomes true
    const adjustDimensionsOfVideoWrapper = () => {
      if (window.innerHeight > (window.innerWidth * 9) / 16) {
        videoWrapperWidth = "auto";
        videoWrapperHeight = "100%";
        videoHeight = window.innerHeight;
        videoWidth = (16 / 9) * videoHeight;
      } else {
        videoWrapperWidth = "100%";
        videoWrapperHeight = "auto";
        videoWidth = window.innerWidth;
        videoHeight = (9 / 16) * videoWidth;
      }
      if (window.innerWidth <= 768) {
        isMobile.set(true);
      } else {
        isMobile.set(false);
      }
      extraWidth = videoWidth - window.innerWidth;
    };
    adjustDimensionsOfVideoWrapper();
    window.addEventListener("resize", adjustDimensionsOfVideoWrapper);

    // add a event listener for mouse movement to animate the panning of the video by changing the left css property
    const mousePan = (e: MouseEvent) => {
      if ($videoIsPlaying && $isImmersive) {
        const videoContainer = document.getElementById("video-container");
        if (videoContainer) {
          if (extraWidth > 0) {
            const percentage = e.clientX / window.innerWidth - 0.5; // Range from -0.5 to +0.5
            const translateX = -percentage * extraWidth;
            videoContainer.style.transition = "";
            videoContainer.style.setProperty("--translateX", `${translateX}px`);
          } else {
            videoContainer.style.setProperty("--translateX", "0px");
          }
        }
      }
    };
    document.addEventListener("mousemove", mousePan);
    const keyHandlers = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && $nextStation) {
        $vimeoVideoObject.setCurrentTime($currentTime + $timeUntilNextStation);
      }
      if (e.key === "ArrowLeft" && $previousStation) {
        $vimeoVideoObject.setCurrentTime(
          hmsToSeconds($previousStation.startTime)
        );
      }
      if (e.key === "ArrowUp") {
        $vimeoVideoObject.setCurrentTime($currentTime - 2);
      }
      if (e.key === "ArrowDown") {
        $vimeoVideoObject.setCurrentTime($currentTime + 2);
      }
      if (e.key === "I") {
        $isImmersive = !$isImmersive;
      }
      if (e.key === "Z" || e.key === "z") {
        const state = recoverState(0);
        if (state) changeToLineAtTime(state.line, state.time);
      }
      if (/^\d$/.test(e.key) && $currentLine?.timeStamps) {
        $vimeoVideoObject.setCurrentTime(
          hmsToSeconds($currentLine.timeStamps[+e.key].startTime)
        );
      }
    };
    document.addEventListener("keydown", keyHandlers);
    return () => {
      window.removeEventListener("resize", adjustDimensionsOfVideoWrapper);
      document.removeEventListener("mousemove", mousePan);
      document.removeEventListener("keydown", keyHandlers);
    };
  });
  $: {
    // center video if immersive mode is off
    if (!$isImmersive && typeof document !== "undefined") {
      const videoContainer = document.getElementById("video-container");
      if (videoContainer) {
        videoContainer.style.transition = "transform 0.5s ease-in-out";
        videoContainer.style.setProperty("--translateX", "0px");
      }
    }
  }
</script>
<svelte:head>
  <title>Tram und Bass</title>
  <meta name="description" content="Tram und Bass - 30 Artists 30 Tramlinien. ">
  <meta name="keywords" content="Tram und Bass, Tram, Bass, Zürich, VBZ, elektronische Musik">
</svelte:head>
  <div
    id="video-container"
    class={$videoIsLoading ? "" : "isLoading"}
    style={`width: ${videoWrapperWidth}; height: ${videoWrapperHeight};`}
  ></div>
  {#if showSplashScreen || !$currentLine?.isReleased}
    <SplashScreen onClick={() => (showSplashScreen = false)} />
  {/if}
  <LoadingScreen
    style={`width: ${videoWrapperWidth}; height: ${videoWrapperHeight};`}
  />
  <VideoControls />
  {#if isDevMode}
    <DevTools />
  {/if}
  {#if initialized && !$cookieConsent}
    <WelcomeScreen line={tempLine} />
  {/if}
  {#if !$isImmersive}
    <TopMenu aboutContent={aboutContent?.aboutText ?? ""} />
    <BottomMenu />
  {/if}

<style lang="scss">
  :root {
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
      src: url("/fonts/NaNHoloNarrow-Regular.woff2") format("woff2");
    }

    @font-face {
      font-family: HoloMono;
      font-style: normal;
      font-weight: 500;
      src: url("/fonts/NaNHoloMono-Medium.woff2") format("woff2");
    }
  }
  #video-container {
    transition: filter 0.5s ease-in-out;
    // &.isLoading {
    //   filter: blur(24px);
    // }
    position: absolute;
    aspect-ratio: 16 / 9;
    pointer-events: none;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translateX(var(--translateX, 0));
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    z-index: -200;
  }
</style>
