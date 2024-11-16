import { get } from 'svelte/store';
import { vimeoVideoObjectList, allLines, vimeoVideoObject, videoIsLoading, devToolsState, timeToSeekAfterVideoLoad, videoIsPlaying, currentTime, currentLine } from '../store';
import Vimeo from '@vimeo/player';
import { switchVideoEventListeners, initVideoIframes } from './registerVimeoEventListeners';
import { goto } from '$app/navigation';
import changeFaviconToLine from "../utils/changeFaviconToLine";

export async function initVideoManager() {
  const lines = get(allLines);
  const devToolsSettings = get(devToolsState);

  vimeoVideoObjectList.set(
    lines
      .filter((line: Line) => 
        devToolsSettings.showAllUnreleasedLines || new Date(line.releaseDate) < new Date()
      )
      .map((line: Line) => {
        const element = document.getElementById(`video-${line.id}`);
        if (!element) {
          console.warn(`Element video-${line.id} not found`);
          return null;
        }

        try {
          return {
            id: line.id,
            player: new Vimeo(element, {
              url: line.videoUrl,
              controls: false,
              autopause: false,
              loop: false,
              autoplay: false,
            }),
          };
        } catch (error) {
          console.error(`Failed to initialize video for line ${line.id}:`, error);
          return null;
        }
      })
      .filter((item): item is {id: string; player: Vimeo} => item !== null)
  );

  try {
    await initVideoIframes();
  } catch (error) {
    console.error('Error loading videos:', error);
  }
  // videoIsLoading.set(false);
}

let previousLineId: string | null = null;
export async function changeVideo(line: Line, isPlay: boolean = true) {
  videoIsPlaying.set(false);
  videoIsLoading.set(true);
  if (!line) {
    console.error('No line provided to changeVideo');
    videoIsLoading.set(false);
    return;
  }

  if (!line.isReleased || !line.videoUrl) {
    console.warn(`Cannot change to video for line ${line.id}: ${!line.isReleased ? 'not released' : 'no video URL'}`);
    videoIsLoading.set(false);
    return;
  }

  if (line.id === previousLineId) {
    return; // Exit if the line ID has not changed
  }
  previousLineId = line.id ?? null;
  // console.log("🎥 changing video to", line.id);
  currentLine.set(line);

  // Update URL and favicon
  const url = new URL(window.location.href);
  url.searchParams.set("line", line.id);
  goto(url.toString(), { replaceState: true });
  changeFaviconToLine(line);

  const videoObjects = get(vimeoVideoObjectList);
  const videoObject = videoObjects.find(obj => obj.id === line.id);
  
  if (!videoObject) {
    console.error(`No video object found for line ${line.id}. Available videos: ${videoObjects.map(v => v.id).join(', ')}`);
    videoIsLoading.set(false);
    return;
  }

  // Get current video object from store
  const currentVideo = get(vimeoVideoObject);
  if (currentVideo) {
    // Hide the current video's iframe using its ID from the store
    const currentVideoId = videoObjects.find(obj => obj.player === currentVideo)?.id;
    if (currentVideoId) {
      const currentIframe = document.querySelector(`#video-${currentVideoId}`);
      if (currentIframe instanceof HTMLElement) {
        currentIframe.classList.remove("activeVideo")
      }
    }
    await currentVideo.pause();
  }

  // Update the vimeoVideoObject store and switch event listeners
  vimeoVideoObject.set(videoObject.player);
  await switchVideoEventListeners(currentVideo, videoObject.player);
  
  // Wait for the video to be ready
  await videoObject.player.ready();
  const seekVideoAfterLoad = async (vimeoObject: Vimeo) => {
    // console.log("🎥 seeking video after load", get(timeToSeekAfterVideoLoad));
    const timeToSeekTo = get(timeToSeekAfterVideoLoad) + 0.1;
    if (timeToSeekTo !== undefined && timeToSeekTo !== null) {
      try {
        // console.log("🎥 timeToSeekTo hello", timeToSeekTo);
        // Wait for video to be loaded
        // await vimeoObject.ready();
        await vimeoObject.setCurrentTime(timeToSeekTo);
        // console.log("🎥 video seeked to", timeToSeekTo);
        timeToSeekAfterVideoLoad.set(0);
      } catch (error) {
        console.error("🎥 Error seeking video:", error);
      }
    }
  };
  seekVideoAfterLoad(videoObject.player).then(() => {
    // console.log("🎥 playing video NOT! heheh");
    if (isPlay) {
      videoObject.player
        .play()
        .then(() => {
          // console.log("🎥 Video is playing");
          videoIsPlaying.set(true);
        })
        .catch((error) => {
          console.error("🎥 Video play error", error);
        });
    }
  });

  // Show the new video's iframe
  const newIframe = document.querySelector(`#video-${line.id}`);
  if (newIframe instanceof HTMLElement) {
    newIframe.classList.add("activeVideo")
  }

  setTimeout(() => {
    videoIsLoading.set(false);
  }, 1000);
}