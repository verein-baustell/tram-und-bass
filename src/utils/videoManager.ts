import { get } from 'svelte/store';
import { vimeoVideoObjectList, allLines, vimeoVideoObject, videoIsLoading, devToolsState, timeToSeekAfterVideoLoad, videoIsPlaying, currentTime } from '../store';
import Vimeo from '@vimeo/player';
import { switchVideoEventListeners, initVideoIframes } from './registerVimeoEventListeners';

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
  videoIsLoading.set(false);
}

export async function changeVideo(line: Line) {
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

  videoIsLoading.set(true);
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

  // Show the new video's iframe
  const newIframe = document.querySelector(`#video-${line.id}`);
  if (newIframe instanceof HTMLElement) {
    newIframe.classList.add("activeVideo")
  }

  // Update the vimeoVideoObject store and switch event listeners
  vimeoVideoObject.set(videoObject.player);
  await switchVideoEventListeners(currentVideo, videoObject.player);
  
  // Wait for the video to be ready
  await videoObject.player.ready();
  const seekVideoAfterLoad = async (vimeoObject: Vimeo) => {
    const timeToSeekTo = get(timeToSeekAfterVideoLoad) + 0.1;
    if (timeToSeekTo !== undefined && timeToSeekTo !== null) {
      try {
        console.log("🎥 timeToSeekTo hello", timeToSeekTo);
        // Wait for video to be loaded
        // await vimeoObject.ready();
        await vimeoObject.setCurrentTime(timeToSeekTo);
        console.log("🎥 video seeked to", timeToSeekTo);
        timeToSeekAfterVideoLoad.set(0);
      } catch (error) {
        console.error("🎥 Error seeking video:", error);
      }
    }
  };
  seekVideoAfterLoad(videoObject.player).then(() => {
   
      console.log("🎥 playing video NOT! heheh");
      videoObject.player
        .play()
        .then(() => {
          console.log("🎥 Video is playing");
          videoIsLoading.set(false);
        })
        .catch((error) => {
          console.error("🎥 Video play error", error);
          videoIsLoading.set(false);
          videoIsPlaying.set(false);
          currentTime.set(0);
        });
  });
  videoIsLoading.set(false);
}