<script lang="ts">
  import { attributes as content } from "../content/lines.md";
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
    vimeoVideoObject,
  } from "../store";
  console.log(content);
  const lines = content.lines;
  // TODO: Generate ids on save in the CMS
  // add missing ids
  lines.forEach((line) => {
    line.id = line.name.replace(/\s/g, "") + line.number;
  });
  // TODO: Want it to maybe pick a random line?
  $currentLine = lines[0];
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
  });
</script>

<div id="video-container"></div>
<VideoControls />
{#if !$isImmersive}
  <TopMenu {lines} aboutContent={"aboutContent"} />
  <BottomMenu {lines} />
{/if}

<style lang="scss">
  #video-container {
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    z-index: -1;
  }
</style>
