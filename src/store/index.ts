import { derived, get, writable, type Readable } from "svelte/store";
import { attributes as content } from "../content/cities.md";
import { hmsToSeconds } from "../utils/timeFormatter";
import { goto } from "$app/navigation";
import changeFaviconToLine from "../utils/changeFaviconToLine";
import {
    getCityNameFromSlug,
    getCityFromSlug,
    getCityShortNameFromSlug,
} from "../utils/getCityNameFromSlug";

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

// Load Cookie
import { browser } from "$app/environment";
// Check if consent has already been given when initializing
const initialConsent = browser
    ? document.cookie.includes("cookieConsent=true")
    : false;
export const cookieConsent = writable(initialConsent);
export const currentCitySlug = writable<string | undefined>();
export const allLines = writable<Line[] | undefined>();

// Derived stores for city information
export const currentCityName = derived(currentCitySlug, ($currentCitySlug) =>
    getCityNameFromSlug($currentCitySlug)
);
export const currentCityShortName = derived(
    currentCitySlug,
    ($currentCitySlug) => getCityShortNameFromSlug($currentCitySlug)
);

export const currentCity = derived(currentCitySlug, ($currentCitySlug) =>
    getCityFromSlug($currentCitySlug)
);

currentCitySlug.subscribe((newCitySlug) => {
    console.log("currentCitySlug", newCitySlug);
    if (newCitySlug) {
        // Find the city using the correct type assertion to include all City properties
        const city = (content.cities as City[]).find(
            (city) => city.slug === newCitySlug
        );
        allLines.set(city?.lines);
    } else {
        allLines.set(undefined);
    }
});
allLines.subscribe((newLines: Line[] | undefined) => {
    newLines?.forEach((line: Line) => {
        line.id = line.name.toLowerCase().replace(/\s/g, "") + line.number;
        line.isReleased =
            new Date(line.releaseDate) < new Date() ||
            get(devToolsState).showAllUnreleasedLines;
    });
});

export const currentLine = writable<Line | undefined>();
// update query params when currentLine changes
export const currentTime = writable<number>(0);
const seekVideoAfterLoad = (muxPlayer: any) => {
    const timeToSeekTo = get(timeToSeekAfterVideoLoad);
    if (timeToSeekTo) {
        muxPlayer.currentTime = timeToSeekTo;
        console.log("🎥 video seeked to", timeToSeekTo);
        timeToSeekAfterVideoLoad.set(0);
    }
};
let previousLineId: string | null = null;
export const timeToSeekAfterVideoLoad = writable<number>(0);
export const isPlayButtonOn = writable<boolean>(false);
currentLine.subscribe((value) => {
    if (value?.id === previousLineId) {
        return; // Exit if the line ID has not changed
    }
    previousLineId = value?.id ?? null;
    if (value && typeof window !== "undefined") {
        videoIsPlaying.set(false);

        const url = new URL(window.location.href);
        url.searchParams.set("line", value.id);
        goto(url.toString(), { replaceState: true });

        changeFaviconToLine(value);

        muxVideoObject.update((muxPlayer) => {
            if (muxPlayer) {
                console.log("⬇️ Attempting to load video", value.videoUrl);
                videoIsLoading.set(true);

                // Set the new video URL
                muxPlayer.playbackId = value.videoUrl;

                // Wait for the video to be ready
                muxPlayer.addEventListener(
                    "canplay",
                    () => {
                        console.log("🎥 Video can play now");
                        seekVideoAfterLoad(muxPlayer); // Seek to the desired position after load

                        // Attempt to play the video
                        muxPlayer
                            .play()
                            .then(() => {
                                seekVideoAfterLoad(muxPlayer);
                                videoIsPlaying.set(true);
                                console.log("🎥 Video is playing");
                            })
                            .catch((error: any) => {
                                console.error("🎥 Video play error", error);
                                videoIsLoading.set(false);
                                videoIsPlaying.set(false);
                            });
                    },
                    { once: true }
                );

                return muxPlayer;
            }
            return muxPlayer;
        });
    }
});

export const previousStation = derived(
    [currentTime, currentLine],
    ([$currentTime, $currentLine]) => {
        const previousStation = $currentLine?.timeStamps
            ?.slice()
            .reverse()
            .find(
                (timeStamp) => hmsToSeconds(timeStamp.startTime) < $currentTime
            );
        return previousStation;
    }
);

export const lastPreviousStation = derived(
    [currentTime, currentLine],
    ([$currentTime, $currentLine]) => {
        const lastPreviousStation = $currentLine?.timeStamps
            ?.slice()
            .reverse()
            .find(
                (timeStamp) => hmsToSeconds(timeStamp.endTime) < $currentTime
            );
        return lastPreviousStation;
    }
);
function getMuxVideoId(videoUrl: string): string | null {
    // Extract video ID from Mux URL format
    const regex = /\/video\/([a-zA-Z0-9]+)/;
    const match = videoUrl.match(regex);
    return match ? match[1] : null;
}
const lastCurrentStation = writable<TimeStamp | undefined>();
/**
 * If we are not at a station, this will be undefined.
 */
export const currentStation: Readable<TimeStamp | undefined> = derived(
    [currentTime, currentLine, lastCurrentStation],
    ([$currentTime, $currentLine, $lastCurrentStation], set) => {
        muxVideoObject && get(muxVideoObject)
            ? (() => {
                  const muxPlayer = get(muxVideoObject);
                  if (!$currentLine) {
                      set(undefined);
                      //   console.log("🚉 no current line");
                      return;
                  }
                  // if the video is not loaded yet, return
                  if (muxPlayer.playbackId !== $currentLine.videoUrl) {
                      set(undefined);
                      //   console.log("🚉 video not loaded");
                      return;
                  }
                  const newStation = $currentLine.timeStamps?.find(
                      (timeStamp) =>
                          hmsToSeconds(timeStamp.startTime) <= $currentTime &&
                          hmsToSeconds(timeStamp.endTime) >= $currentTime
                  );
                  if (!newStation) {
                      set(undefined);
                      //   console.log("🚉 no current station");
                      return;
                  }
                  if (newStation !== $lastCurrentStation) {
                      console.log(
                          "🚉 new station",
                          newStation,
                          $lastCurrentStation
                      );
                      set(newStation);
                      lastCurrentStation.set(newStation);
                  }
                  //   console.log("🚉 last current station", $lastCurrentStation);
              })()
            : null;
    }
);
/**
 * All lines that have a station at the currentStation. If we are not at a station, this will be undefined.
 */
export const linesAtCurrentStation = derived(
    [currentStation, currentLine, allLines],
    ([$currentStation, $currentLine, $allLines]) => {
        if (!$currentStation || !$currentLine || !$allLines) return;
        return $allLines.filter((line) => {
            return line.timeStamps?.find(
                (timeStamp) =>
                    timeStamp.name === $currentStation.name &&
                    line.id !== $currentLine.id
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
export const videoIsSeeking = writable<boolean>(false);
export const isImmersive = writable<boolean>(false);
export const isMenuMinimized = writable<boolean>(false);
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
export const muxVideoObject = writable<any>();
muxVideoObject.subscribe((muxPlayer) => {
    console.log(
        "muxVideoObject updated:",
        muxPlayer ? "Player available" : "Player undefined"
    );
    if (muxPlayer) {
        lastCurrentStation.set(undefined);
    }
});

// history variables
const historyKey = "history";

// Check if there's an existing state in local storage
const storedHistory =
    typeof localStorage != "undefined"
        ? localStorage.getItem(historyKey)
        : "[]";

// Define the initial state for the store
const initialHistory = storedHistory ? JSON.parse(storedHistory) : [];

// Create a writable store with the initial state
export const history = writable<State[]>(initialHistory);

// Subscribe to the store and save any changes to local storage
history.subscribe((value) => {
    typeof localStorage != "undefined"
        ? localStorage.setItem(historyKey, JSON.stringify(value))
        : "[]";
});
