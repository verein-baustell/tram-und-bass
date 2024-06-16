<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import Vimeo from "@vimeo/player";
  import { onMount } from "svelte";
  import TopMenu from "$lib/TopMenu.svelte";
  import VideoControls from "$lib/VideoControls.svelte";
  import BottomMenu from "$lib/BottomMenu.svelte";
  import Map from "$lib/Map.svelte";
  import {
    currentLine,
    isImmersive,
    isMuted,
    videoIsPlaying,
    vimeoVideoObject,allLines
  } from "../store";
  let videoWrapperWidth = "100%";
  let videoWrapperHeight = "100%";
  
  // TODO: Want it to maybe pick a random line?
  $currentLine = $allLines[0];
  onMount(() => {
    $vimeoVideoObject = new Vimeo("video-container", {
      url: $currentLine.videoUrl,
      controls: false,
      autopause: false,
      loop: true,
    });
    $vimeoVideoObject.on("playing", (e) => {
      console.log("playing", e);
      $videoIsPlaying = true;
    });
    $vimeoVideoObject.on("pause", (e) => {
      console.log("pause", e);
      $videoIsPlaying = false;
    });
    $vimeoVideoObject.on("volumechange", () => {
      $vimeoVideoObject.getMuted().then((muted) => {
        $isMuted = muted;
      });
    });
    $vimeoVideoObject.ready().then(() => {
      const iframe: HTMLIFrameElement | null = document.querySelector(
        "#video-container iframe"
      );
      if (iframe) {
        iframe.style.minWidth = "100%";
        iframe.style.minHeight = "100%";
      }
    });
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
  style={`width: ${videoWrapperWidth}; height: ${videoWrapperHeight};`}
></div>
<VideoControls />
{#if !$isImmersive}
  <TopMenu aboutContent={"aboutContent"} />
  <BottomMenu />
{/if}

<style lang="scss">
  #video-container {
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
