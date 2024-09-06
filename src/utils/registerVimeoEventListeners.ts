import { get } from "svelte/store";
import {
  currentTime,
  isMuted,
  videoIsPlaying,
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
