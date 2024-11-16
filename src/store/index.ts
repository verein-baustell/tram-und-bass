import { derived, get, writable, type Readable } from "svelte/store";
import { attributes as content } from "../content/lines.md";
import { hmsToSeconds } from "../utils/timeFormatter";
const lines = content.lines;

// dev tools delete for production
// Define a key to use for local storage
const localStorageKey = "devToolsState";

// Check if there's an existing state in local storage
const storedState =
  typeof localStorage != "undefined"
    ? localStorage.getItem(localStorageKey)
    : "false";

// Define the initial state for the store
const initialState = storedState
  ? JSON.parse(storedState)
  : { showAllUnreleasedLines: false };

// Create a writable store with the initial state
export const devToolsState = writable<DevToolsState>(initialState);

// Subscribe to the store and save any changes to local storage
devToolsState.subscribe((value) => {
  typeof localStorage != "undefined"
    ? localStorage.setItem(localStorageKey, JSON.stringify(value))
    : "false";
});

// Create a store for the list of Vimeo players
export const vimeoVideoObjectList = writable<{id: string, player: Vimeo}[]>([]);


// Load Cookie
import { browser } from '$app/environment';
// Check if consent has already been given when initializing
const initialConsent = browser ? document.cookie.includes('cookieConsent=true') : false;
export const cookieConsent = writable(initialConsent);

lines.forEach((line) => {
  line.id = line.name.toLowerCase().replace(/\s/g, "") + line.number;
  line.isReleased =
    new Date(line.releaseDate) < new Date() ||
    get(devToolsState).showAllUnreleasedLines;
});

export const allLines = writable<Line[]>(lines);
export const currentLine = writable<Line | undefined>();
// update query params when currentLine changes
export const currentTime = writable<number>(0);

export const timeToSeekAfterVideoLoad = writable<number>(0);

let lastPreviousStation: TimeStamp | undefined;
export const previousStation = derived(
  [currentTime, currentLine],
  ([$currentTime, $currentLine]) => {
    const newPreviousStation = $currentLine?.timeStamps
      ?.toReversed()
      .find(
        (timeStamp) =>
          hmsToSeconds(timeStamp.startTime) < $currentTime &&
          hmsToSeconds(timeStamp.endTime) < $currentTime
      );

    if (newPreviousStation !== lastPreviousStation) {
      lastPreviousStation = newPreviousStation;
      return newPreviousStation;
    }
    return lastPreviousStation;
  }
);
function getVimeoVideoId(videoUrl: string): number | null {
  const regex = /vimeo\.com\/video\/(\d+)/;
  const match = videoUrl.match(regex);
  return match ? +match[1] : null;
}
const lastCurrentStation = writable<TimeStamp>();
/**
 * If we are not at a station, this will be undefined.
 */
export const currentStation: Readable<TimeStamp | undefined> = derived(
  [currentTime, currentLine, lastCurrentStation],
  ([$currentTime, $currentLine, $lastCurrentStation], set) => {
    vimeoVideoObject &&
      get(vimeoVideoObject)
        ?.getVideoId()
        .then((currentVideoId) => {
          if (!$currentLine) {
            set(undefined);
            return;
          }
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
          if (newStation !== $lastCurrentStation) {
            // console.log("🚉 new station", newStation, $lastCurrentStation);
            set(newStation);
            lastCurrentStation.set(newStation);
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
    if (!$currentStation || !$currentLine) return;
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

export const isTopOpen = writable<boolean>(false);
export const isBtmOpen = writable<boolean>(false);
export const videoIsPlaying = writable<boolean>(false);
export const isWider = writable<boolean>(false);
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
    if ($nextStation && $currentLine) {
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

// history variables
const historyKey = "history";

// Check if there's an existing state in local storage
const storedHistory =
  typeof localStorage != "undefined"
    ? localStorage.getItem(historyKey)
    : "[]";

// Define the initial state for the store
const initialHistory = storedHistory
  ? JSON.parse(storedHistory)
  : [];

// Create a writable store with the initial state
export const history = writable<State[]>(initialHistory)

// Subscribe to the store and save any changes to local storage
history.subscribe((value) => {
  typeof localStorage != "undefined"
    ? localStorage.setItem(historyKey, JSON.stringify(value))
    : "[]";
});