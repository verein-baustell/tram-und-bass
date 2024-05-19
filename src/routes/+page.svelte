<script lang="ts">
  import { attributes as content } from "../content/lines.md";
  import SvelteMarkdown from "svelte-markdown";
  import Button from "../lib/Button.svelte";
  import Vimeo from "@vimeo/player";
  import { onMount } from "svelte";

  const lines = content.lines;
  const currentLine = lines[0];
  let player: Vimeo;
  onMount(() => {
    player = new Vimeo("video-container", {
      url: currentLine.videoUrl,
      controls: false,
    });
    player.ready().then(() => {
      const iframe: HTMLIFrameElement | null = document.querySelector("#video-container iframe");
      if (iframe) {
        iframe.style.minWidth = "100%";
        iframe.style.minHeight = "100%";
      }
    });
  });
  const playVideo = () => {
    console.log("play video");
    player.play();
  };
</script>

<h1>Welcome to TnB</h1>
<p>artist: {currentLine.artistName}</p>
<p>name: {currentLine.name}</p>
<div id="video-container"></div>
<SvelteMarkdown source={currentLine.artistAboutText} />
<Button on:click={() => playVideo()}>Play</Button>

<style lang="scss">
  #video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    z-index: -1;
  }
</style>
