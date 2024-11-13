import { get } from 'svelte/store';
import { vimeoVideoObjectList, allLines, vimeoVideoObject, videoIsLoading } from '../store';
import Vimeo from '@vimeo/player';
import { switchVideoEventListeners, initVideoIframes } from './registerVimeoEventListeners';

export async function initVideoManager() {
  const lines = get(allLines);
  vimeoVideoObjectList.set(
    lines
      .map((line: Line) => {
        const element = document.getElementById(`video-${line.id}`);
        if (!element) {
          console.warn(`Element video-${line.id} not found`);
          return null;
        }

        return {
          id: line.id,
          player: new Vimeo(element, {
            url: line.videoUrl,
            controls: false,
            autopause: false,
            loop: false,
          }),
        };
      })
      .filter((item): item is {id: string; player: Vimeo} => item !== null)
  );

  // Wait for all videos to load
  try {
    await initVideoIframes();
    // All videos are now loaded and ready to play
  } catch (error) {
    console.error('Error loading videos:', error);
  }
  videoIsLoading.set(false);
}

export async function changeVideo(line: Line) {
  videoIsLoading.set(true);
  const videoObjects = get(vimeoVideoObjectList);
  const videoObject = videoObjects.find(obj => obj.id === line.id);
  
  if (!videoObject) {
    console.error(`No video object found for line ${line.id}`);
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
        currentIframe.style.display = 'none';
      }
    }
    await currentVideo.pause();
  }

  // Show the new video's iframe
  const newIframe = document.querySelector(`#video-${line.id}`);
  if (newIframe instanceof HTMLElement) {
    newIframe.style.display = 'block';
  }

  // Update the vimeoVideoObject store and switch event listeners
  vimeoVideoObject.set(videoObject.player);
  switchVideoEventListeners(currentVideo, videoObject.player);
  
  await videoObject.player.play();
  videoIsLoading.set(false);
}