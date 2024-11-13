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

export default () => {
  const videoObjects = get(vimeoVideoObjectList);

  videoObjects.forEach(({id, player}) => {
    player.ready().then(() => {
      const iframe = document.querySelector<HTMLElement>(
        `#video-${id} iframe`
      );
      if (iframe) {
        iframe.style.minWidth = "100%";
        iframe.style.minHeight = "100%";
      }
    });

    player.on("timeupdate", function (data) {
      currentTime.set(data.seconds);
    });

    // Track loading of the video
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
  });
};
