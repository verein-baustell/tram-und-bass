import { get } from "svelte/store";
import {
  currentTime,
  isMuted,
  videoIsPlaying,
  videoIsLoading,
  vimeoVideoObject,
} from "../store";
export default () => {
  const vimeo = get(vimeoVideoObject);
  vimeo.ready().then(() => {
    const iframe: HTMLIFrameElement | null = document.querySelector(
      "#video-container iframe"
    );
    if (iframe) {
      iframe.style.minWidth = "100%";
      iframe.style.minHeight = "100%";
    }
  });

  vimeo.on("timeupdate", function (data) {
    currentTime.set(data.seconds);
  });

  // Track laoding of the video
  // Detect when the video starts loading (buffering)
  vimeo.on("bufferstart", (e) => {
    console.log("loading start", e);
    videoIsLoading.set(true); 
  });
  // Detect when buffering ends (video is ready to play)
  vimeo.on("bufferend", (e) => {
    console.log("loading end", e);
    setTimeout(() => {
      videoIsLoading.set(false); // Change the variable after the delay to prevent jumping values
    }, 500);
  });
  // Detect when loading ends (video is ready to play)
  // vimeo.on("loaded", (e) => {
  //   console.log("loaded", e);
  //   setTimeout(() => {
  //     videoIsLoading.set(false); // Change the variable after the delay to prevent jumping values
  //   }, 0);
  // });

  vimeo.on("playing", (e) => {
    console.log("playing", e);
    videoIsPlaying.set(true); // Corrected
  });
  vimeo.on("pause", (e) => {
    console.log("pause", e);
    videoIsPlaying.set(false); // Corrected
  });
  vimeo.on("ended", (e) => {
    console.log("ended", e);
    videoIsPlaying.set(false); // Corrected
  });
  vimeo.on("volumechange", () => {
    vimeo.getMuted().then((muted) => {
      isMuted.set(muted); // Corrected
    });
  });
};
