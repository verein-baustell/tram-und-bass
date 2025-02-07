import { get } from "svelte/store";
import {
    vimeoVideoObjectList,
    allLines,
    vimeoVideoObject,
    videoIsLoading,
    devToolsState,
    timeToSeekAfterVideoLoad,
    videoIsPlaying,
    currentTime,
    currentLine,
    isMuted,
} from "../store";
import Vimeo from "@vimeo/player";
import registerVimeoEventListeners from "../utils/registerVimeoEventListeners";
import { goto } from "$app/navigation";
import changeFaviconToLine from "../utils/changeFaviconToLine";

export function initVideoManager() {
    vimeoVideoObject.set(
        new Vimeo("video-container", {
            url: get(allLines)[0].videoUrl,
            controls: false,
            autopause: false,
            loop: false,
        })
    );
    registerVimeoEventListeners();
}

let previousLineId: string | null = null;
let videoLoadCounter = 0;

export async function changeVideo(line: Line, isPlay: boolean = true) {
    try {
        videoIsPlaying.set(false);
        videoIsLoading.set(true);

        if (!line) {
            throw new Error("No line provided to changeVideo");
        }

        if (!line.isReleased || !line.videoUrl) {
            throw new Error(
                `Cannot change to video for line ${line.id}: ${
                    !line.isReleased ? "not released" : "no video URL"
                }`
            );
        }

        if (line.id === previousLineId) {
            videoIsLoading.set(false);
            return;
        }

        previousLineId = line.id ?? null;
        currentLine.set(line);

        // Update URL and favicon
        const url = new URL(window.location.href);
        url.searchParams.set("line", line.id);
        goto(url.toString(), { replaceState: true });
        changeFaviconToLine(line);

        // Get current video object
        const currentVideo = get(vimeoVideoObject);
        // if (currentVideo) {
        //     try {
        //         await currentVideo.pause();
        //         await new Promise((resolve) => setTimeout(resolve, 100));
        //     } catch (error) {
        //         console.warn("Error while pausing current video:", error);
        //     }
        // }

        vimeoVideoObject.update((vimeo) => {
            if (vimeo) {
                console.log("⬇️ Attempting to load video", line.videoUrl);
                videoIsLoading.set(true);

                vimeo
                    .loadVideo(line.videoUrl)
                    .then(() => {
                        currentTime.set(0);
                        console.log("🎥 Video loaded successfully");
                        seekVideoAfterLoad(vimeo);
                        videoIsLoading.set(false);

                        videoLoadCounter++;
                        // Attempt to play the video after third load
                        if (videoLoadCounter >= 2) {
                            // vimeo
                            //     .play()
                            //     .then(() => {
                            //         console.log(
                            //             "🎥 Video is playing after 3rd load"
                            //         );
                            //     })
                            //     .catch((error) => {
                            //         console.error("🎥 Video play error", error);
                            //     });
                        }
                    })
                    .catch((error) => {
                        console.error("🎥 Video load error", error);
                    });
            }
            return vimeo;
        });
    } catch (error) {
        console.error("Error during video change:", error);
    } finally {
        // console.log("setting videoIsLoading to false");
        // videoIsLoading.set(false);
    }
}

const seekVideoAfterLoad = async (vimeoObject: Vimeo) => {
    try {
        await vimeoObject.ready();
        // Add a delay to ensure player is fully initialized
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const timeToSeekTo = get(timeToSeekAfterVideoLoad) + 0.1;
        if (timeToSeekTo !== undefined && timeToSeekTo !== null) {
            await Promise.race([
                vimeoObject.setCurrentTime(timeToSeekTo),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Seek timeout")), 5000)
                ),
            ]);
            timeToSeekAfterVideoLoad.set(0);
        }
        return true;
    } catch (error) {
        console.error("🎥 Error seeking video:", error);
        return false;
    }
};
