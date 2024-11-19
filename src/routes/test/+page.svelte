<script lang="ts">
  import Vimeo from "@vimeo/player";
  import { allLines } from "../../store";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  let vimeoVideoObjectList: Vimeo[] = [];
  const lines = get(allLines); // Get all lines from the store

  onMount(() => {
    if (typeof window !== "undefined") {
      // Initialize the Vimeo players for each line in allLines
      vimeoVideoObjectList = lines.map(
        (line, index) =>
          new Vimeo(`video-${index}`, {
            url: line.videoUrl,
            controls: false,
            autopause: false,
            loop: false,
          })
      );
    }
    // console.log(vimeoVideoObjectList);
  });

  function playVideo(index: number) {
    // Pause all videos and hide all iframes
    vimeoVideoObjectList.forEach((video, i) => {
      video.pause();
      const iframe = document.getElementById(`video-${i}`);
      if (iframe) {
        iframe.style.display = "none";
      }
    });

    // Play the selected video and show its iframe
    const selectedVideo = vimeoVideoObjectList[index];
    const selectedIframe = document.getElementById(`video-${index}`);
    if (selectedVideo && selectedIframe) {
      selectedIframe.style.display = "block";
      selectedVideo.play();
    }
  }
</script>

<div class="content">
  <h1>Test Page</h1>

  {#each lines as line, index}
    <!-- Button to play each video -->
    <button on:click={() => playVideo(index)}>Play Video {index + 1}</button>
  {/each}

  <!-- Single container for all videos -->
  <div id="video-container">
    {#each lines as line, index}
      <div id={`video-${index}`} style="display: none;"></div>
    {/each}
  </div>
</div>

<style scoped>
  .content {
    background: white !important;
  }

  #video-container {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
