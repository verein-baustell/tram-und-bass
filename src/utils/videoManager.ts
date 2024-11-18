import { get } from 'svelte/store';
import { vimeoVideoObjectList, allLines, vimeoVideoObject, videoIsLoading, devToolsState, timeToSeekAfterVideoLoad, videoIsPlaying, currentTime, currentLine, changeVideoInProgress } from '../store';
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
              // qualityRequest: '360p'
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
  try {
    videoIsPlaying.set(false);
    videoIsLoading.set(true);
    changeVideoInProgress.set(true);
    
    if (!line) {
      throw new Error('No line provided to changeVideo');
    }

    if (!line.isReleased || !line.videoUrl) {
      throw new Error(`Cannot change to video for line ${line.id}: ${!line.isReleased ? 'not released' : 'no video URL'}`);
    }

    if (line.id === previousLineId) {
      videoIsLoading.set(false);
      changeVideoInProgress.set(false);
      return;
    }
    
    previousLineId = line.id ?? null;
    currentLine.set(line);

    // Update URL and favicon
    const url = new URL(window.location.href);
    url.searchParams.set("line", line.id);
    goto(url.toString(), { replaceState: true });
    changeFaviconToLine(line);

    const videoObjects = get(vimeoVideoObjectList);
    const videoObject = videoObjects.find(obj => obj.id === line.id);
    
    if (!videoObject) {
      throw new Error(`No video object found for line ${line.id}`);
    }

    // Get current video object from store
    const currentVideo = get(vimeoVideoObject);
    if (currentVideo) {
      try {
        const currentVideoId = videoObjects.find(obj => obj.player === currentVideo)?.id;
        if (currentVideoId) {
          const currentIframe = document.querySelector(`#video-${currentVideoId}`);
          if (currentIframe instanceof HTMLElement) {
            currentIframe.classList.remove("activeVideo");
          }
        }
        await currentVideo.pause();
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay after pause
      } catch (error) {
        console.warn('Error while pausing current video:', error);
      }
    }

    // Update the vimeoVideoObject store and switch event listeners
    vimeoVideoObject.set(videoObject.player);
    await videoObject.player.ready(); // Ensure new player is ready
    await switchVideoEventListeners(currentVideo, videoObject.player);

    // Play the video if requested
    if (isPlay) {
      await videoObject.player.setMuted(true);
      await videoObject.player.play().catch(console.warn);
    }

    await seekVideoAfterLoad(videoObject.player);
    
    // Show the new video's iframe
    const newIframe = document.querySelector(`#video-${line.id}`);
    if (newIframe instanceof HTMLElement) {
      newIframe.classList.add("activeVideo");
    }
    
    videoObject.player.setMuted(false);
  } catch (error) {
    console.error('Error during video change:', error);
  } finally {
    videoIsLoading.set(false);
    changeVideoInProgress.set(false);
  }
}

const seekVideoAfterLoad = async (vimeoObject: Vimeo) => {
  try {
    await vimeoObject.ready();
    // Add a delay to ensure player is fully initialized
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const timeToSeekTo = get(timeToSeekAfterVideoLoad) + 0.1;
    if (timeToSeekTo !== undefined && timeToSeekTo !== null) {
      await Promise.race([
        vimeoObject.setCurrentTime(timeToSeekTo),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Seek timeout')), 5000)
        )
      ]);
      timeToSeekAfterVideoLoad.set(0);
    }
    return true;
  } catch (error) {
    console.error("🎥 Error seeking video:", error);
    return false;
  }
};