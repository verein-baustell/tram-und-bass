import { derived, get, writable, type Readable } from "svelte/store";
import { attributes as content } from "../content/lines.md";
import { hmsToSeconds } from "../utils/timeFormatter";
import { goto } from "$app/navigation";
import changeFaviconToLine from "../utils/changeFaviconToLine";
const lines = content.lines;

// dev tools delete for production
// Define a key to use for local storage
const localStorageKey = 'devToolsState';

// Check if there's an existing state in local storage
const storedState = typeof localStorage != "undefined" ? localStorage.getItem(localStorageKey) : "false";

// Define the initial state for the store
const initialState = storedState
  ? JSON.parse(storedState)
  : { showAllUnreleasedLines: false };

// Create a writable store with the initial state
export const devToolsState = writable<DevToolsState>(initialState);

// Subscribe to the store and save any changes to local storage
devToolsState.subscribe((value) => {
  typeof localStorage != "undefined" ? localStorage.setItem(localStorageKey, JSON.stringify(value)) : "false";
});

lines.forEach((line) => {
  line.id = line.name.toLowerCase().replace(/\s/g, "") + line.number;
  line.isReleased = new Date(line.releaseDate) < new Date() || get(devToolsState).showAllUnreleasedLines;
});

export const allLines = writable<Line[]>(lines);
export const currentLine = writable<Line>();
// update query params when currentLine changes
export const currentTime = writable<number>(0);
const seekVideoAfterLoad = (vimeoObject: Vimeo) => {
  const timeToSeekTo = get(timeToSeekAfterVideoLoad);
  if (timeToSeekTo) {
    vimeoObject.setCurrentTime(timeToSeekTo).then(() => {
      console.log("🎥 video seeked to", timeToSeekTo);
    });
    timeToSeekAfterVideoLoad.set(0);
  }
};
let previousLineId: string | null = null;
export const timeToSeekAfterVideoLoad = writable<number>(0);
currentLine.subscribe((value) => {
  if (value?.id === previousLineId) {
    return; // Exit if the line ID has not changed
  }
  // Update the previous line ID
  previousLineId = value?.id;
  if (value && typeof window !== "undefined") {
    videoIsPlaying.set(false);
    videoIsLoading.set(true);
    const url = new URL(window.location.href);
    url.searchParams.set("line", value.id);
    goto(url.toString(), { replaceState: true });
    changeFaviconToLine(value);
    vimeoVideoObject.update((vimeo) => {
      if (vimeo) {
        console.log("⬇️ try to load video", value.videoUrl);
        vimeo
          .loadVideo(value.videoUrl)
          .then(() => {
            console.log("🎥 video loaded");
            console.log({ vimeo });
            seekVideoAfterLoad(vimeo);
            vimeo
              .play()
              .then(() => {
                seekVideoAfterLoad(vimeo);
                console.log("🎥 video is playing at 2nd attempt");
              })
              .catch((error) => {
                console.error("🎥 video play error", error);
              });
          })
          .catch((error) => {
            console.error("🎥 video load error", error);
          });
      }
      return vimeo;
    });
  }
});
export const previousStation = writable<TimeStamp>();
function getVimeoVideoId(videoUrl: string): number | null {
  const regex = /vimeo\.com\/video\/(\d+)/;
  const match = videoUrl.match(regex);
  return match ? +match[1] : null;
}
/**
 * If we are not at a station, this will be undefined.
 */
export const currentStation: Readable<TimeStamp | undefined> = derived(
  [currentTime, currentLine, previousStation],
  ([$currentTime, $currentLine, $previousStation], set) => {
    vimeoVideoObject &&
      get(vimeoVideoObject)?.getVideoId()
        .then((currentVideoId) => {
          // if the video is not loaded yet, return
          if (currentVideoId !== getVimeoVideoId($currentLine.videoUrl)) {
            set(undefined);
            return;
          }
          const newStation = $currentLine.timeStamps?.find(
            (timeStamp) =>
              hmsToSeconds(timeStamp.startTime) <= $currentTime &&
              hmsToSeconds(timeStamp.endTime) >= $currentTime
          );
          if (!newStation) {
            set(undefined);
            return;
          }
          if (newStation !== $previousStation) {
            previousStation.set(newStation);
            set(newStation);
          }
        });
  }
);
/**
 * All lines that have a station at the currentStation. If we are not at a station, this will be undefined.
 */
export const linesAtCurrentStation = derived(
  [currentStation, currentLine, allLines],
  ([$currentStation, $currentLine, $allLines]) => {
    if (!$currentStation) return;
    return $allLines.filter((line) => {
      return line.timeStamps?.find(
        (timeStamp) =>
          timeStamp.name === $currentStation.name && line.id !== $currentLine.id
      );
    });
  }
);
export const nextStation = derived(
  [currentTime, currentLine],
  ([$currentTime, $currentLine]) => {
    const nextStation = $currentLine?.timeStamps?.find(
      (timeStamp) => hmsToSeconds(timeStamp.startTime) > $currentTime
    );
    return nextStation;
  }
);
export const isTopOpen = writable<boolean>(false)
export const isBtmOpen = writable<boolean>(false)
export const videoIsPlaying = writable<boolean>(false);
// extra variable if the video is loading
export const videoIsLoading = writable<boolean>(false);
export const isImmersive = writable<boolean>(false);
export const isMenuClosed = writable<boolean>(false);
export const isMuted = writable<boolean>(false);
export const isMobile = writable<boolean>(false);
export const isAtStation = writable<boolean>(false);
export const timeUntilNextStation = derived(
  [currentLine, currentTime, nextStation],
  ([$currentLine, $currentTime, $nextStation]) => {
    if ($nextStation) {
      const nextStartTimeString = $currentLine.timeStamps?.find(
        (timeStamp) => timeStamp.name === $nextStation.name
      )?.startTime;
      const nextStartTime = hmsToSeconds(nextStartTimeString);
      if (typeof nextStartTime === "number") {
        return nextStartTime - $currentTime;
      }
    }
    return 0;
  }
);
export const vimeoVideoObject = writable<Vimeo>();
vimeoVideoObject.subscribe((vimeo) => {});

