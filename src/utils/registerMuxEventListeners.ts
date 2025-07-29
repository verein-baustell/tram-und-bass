import { get } from "svelte/store";
import {
    currentTime,
    isMuted,
    videoIsPlaying,
    videoIsLoading,
    muxVideoObject,
    allLines,
    currentLine,
    isPlayButtonOn,
} from "../store";

export default () => {
    const muxPlayer = get(muxVideoObject);

    if (!muxPlayer) return;

    // Set up event listeners for Mux Player
    muxPlayer.addEventListener("loadedmetadata", () => {
        console.log("Video metadata loaded");
    });

    muxPlayer.addEventListener("timeupdate", () => {
        currentTime.set(muxPlayer.currentTime);
    });

    // Track loading of the video
    muxPlayer.addEventListener("loadstart", () => {
        console.log("loading start");
        videoIsLoading.set(true);
    });

    muxPlayer.addEventListener("canplay", () => {
        console.log("loading end");
        setTimeout(() => {
            videoIsLoading.set(false); // Change the variable after the delay to prevent jumping values
        }, 500);
    });

    muxPlayer.addEventListener("play", () => {
        console.log("playing");
        videoIsPlaying.set(true);
        isPlayButtonOn.set(false);
    });

    muxPlayer.addEventListener("pause", () => {
        console.log("pause");
        videoIsPlaying.set(false);
    });

    muxPlayer.addEventListener("ended", () => {
        console.log("ended");
        const releasedLines = get(allLines).filter((line) => line.isReleased);
        let randomIndex = Math.floor(
            Math.random() * (releasedLines.length - 1)
        );
        currentLine.set(releasedLines[randomIndex]);
    });

    muxPlayer.addEventListener("volumechange", () => {
        isMuted.set(muxPlayer.muted);
    });
};
