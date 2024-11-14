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
  
  const loadingPromises = videoObjects.map(({id, player}) => {
    return new Promise<void>((resolve) => {
      player.ready().then(() => {
        const iframe = document.querySelector<HTMLElement>(`#video-${id} iframe`);
        if (iframe) {
          iframe.style.minWidth = "100%";
          iframe.style.minHeight = "100%";
          
          const currentAllow = iframe.getAttribute('allow') || '';
          const newAllow = currentAllow.replace('autoplay;', '');
          iframe.setAttribute('allow', newAllow);
        }
        
        player.on('loaded', () => {
          resolve();
        });
      });
    });
  });

  return Promise.all(loadingPromises).then(() => {
    console.log('All videos loaded successfully');
  });
}

export async function unregisterEventListeners(player: Vimeo) {
  await Promise.all([
    player.off('timeupdate'),
    player.off('bufferstart'),
    player.off('bufferend'),
    player.off('playing'),
    player.off('pause'),
    player.off('ended'),
    player.off('volumechange')
  ]);
}

export async function registerEventListeners(player: Vimeo) {
  await Promise.all([
    player.on("timeupdate", function (data) {
      currentTime.set(data.seconds);
    }),
    player.on("bufferstart", (e) => {
      console.log("loading start", e);
      videoIsLoading.set(true);
    }),
    player.on("bufferend", (e) => {
      console.log("loading end", e);
      setTimeout(() => {
        videoIsLoading.set(false);
      }, 500);
    }),
    player.on("playing", (e) => {
      console.log("playing", e);
      videoIsPlaying.set(true);
    }),
    player.on("pause", (e) => {
      console.log("pause", e);
      videoIsPlaying.set(false);
    }),
    player.on("ended", (e) => {
      console.log("ended", e);
      const releasedLines = get(allLines).filter((line) => line.isReleased);
      let randomIndex = Math.floor(Math.random() * (releasedLines.length - 1));
      currentLine.set(releasedLines[randomIndex]);
    }),
    player.on("volumechange", () => {
      player.getMuted().then((muted) => {
        isMuted.set(muted);
      });
    })
  ]);
}

export async function switchVideoEventListeners(oldPlayer: Vimeo | null, newPlayer: Vimeo) {
  if (oldPlayer) {
    await unregisterEventListeners(oldPlayer);
  }
  await registerEventListeners(newPlayer);
}
