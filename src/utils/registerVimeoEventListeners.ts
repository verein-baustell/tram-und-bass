import { get } from "svelte/store";
import {
  currentTime,
  isMuted,
  videoIsPlaying,
  videoIsLoading,
  allLines,
  currentLine,
  vimeoVideoObjectList
} from "../store";

export function initVideoIframes(): Promise<void> {
  const videoObjects = get(vimeoVideoObjectList);
  
  // Create an array of promises for each video's loading
  const loadingPromises = videoObjects.map(({id, player}) => {
    return new Promise<void>((resolve) => {
      player.ready().then(() => {
        // Set up iframe styles
        const iframe = document.querySelector<HTMLElement>(`#video-${id} iframe`);
        if (iframe) {
          iframe.style.minWidth = "100%";
          iframe.style.minHeight = "100%";
        }
        
        // Listen for the loaded event
        player.on('loaded', () => {
          resolve();
        });
      });
    });
  });

  // Return a promise that resolves when all videos are loaded
  return Promise.all(loadingPromises).then(() => {
    
    console.log('All videos loaded successfully');
  });
}

export function registerEventListeners(player: Vimeo) {
  player.on("timeupdate", function (data) {
    currentTime.set(data.seconds);
  });

  player.on("bufferstart", (e) => {
    console.log("loading start", e);
    videoIsLoading.set(true);
  });

  player.on("bufferend", (e) => {
    console.log("loading end", e);
    setTimeout(() => {
      videoIsLoading.set(false);
    }, 500);
  });

  player.on("playing", (e) => {
    console.log("playing", e);
    videoIsPlaying.set(true);
  });

  player.on("pause", (e) => {
    console.log("pause", e);
    videoIsPlaying.set(false);
  });

  player.on("ended", (e) => {
    console.log("ended", e);
    const releasedLines = get(allLines).filter((line) => line.isReleased);
    let randomIndex = Math.floor(Math.random() * (releasedLines.length - 1));
    currentLine.set(releasedLines[randomIndex]);
  });

  player.on("volumechange", () => {
    player.getMuted().then((muted) => {
      isMuted.set(muted);
    });
  });
}

export function unregisterEventListeners(player: Vimeo) {
  player.off('timeupdate');
  player.off('bufferstart');
  player.off('bufferend');
  player.off('playing');
  player.off('pause');
  player.off('ended');
  player.off('volumechange');
}

export function switchVideoEventListeners(oldPlayer: Vimeo | null, newPlayer: Vimeo) {
  if (oldPlayer) {
    unregisterEventListeners(oldPlayer);
  }
  registerEventListeners(newPlayer);
}
