import { derived, get, writable } from "svelte/store";
import { attributes as content } from "../content/lines.md";
import { hmsToSeconds } from "../utils/timeFormatter";
const lines = content.lines;
// TODO: Generate ids on save in the CMS
// add missing ids
lines.forEach((line) => {
  line.id = line.name.replace(/\s/g, "") + line.number;
});
export const allLines = writable<Line[]>(lines);
export const currentLine = writable<Line>();
// update query params when currentLine changes
export const currentTime = writable<number>(0);
const seekVideoAfterLoad = (vimeoObject: Vimeo) => {
  const timeToSeekTo = get(timeToSeekAfterVideoLoad);
  if (timeToSeekTo) {
    vimeoObject.setCurrentTime(timeToSeekTo).then(() => {
      console.log("🎥 video seeked to", timeToSeekTo)
    });
    timeToSeekAfterVideoLoad.set(0);
  }
};
export const timeToSeekAfterVideoLoad = writable<number>(0);
currentLine.subscribe((value) => {
  if (value && typeof window !== "undefined") {
    const url = new URL(window.location.href);
    url.searchParams.set("line", value.id);
    window.history.replaceState(null, "", url.toString());

    vimeoVideoObject.update((vimeo) => {
      if (vimeo) {
        console.log("⬇️ load video", value.videoUrl);
        vimeo.loadVideo(value.videoUrl).then(() => {
          console.log("🎥 video loaded");
          console.log({ vimeo });
          seekVideoAfterLoad(vimeo);
          if (videoIsPlaying) return;
          vimeo
            .play()
            .then(() => {
              seekVideoAfterLoad(vimeo);
              console.log("🎥 video is playing");
            })
            .catch((error) => {
              console.error("🎥 video play error", error);
            });
        });
      }
      return vimeo;
    });
  }
});

/**
 * If we are not at a station, this will be undefined.
 */
export const currentStation = derived(
  [currentTime, currentLine],
  ([$currentTime, $currentLine]) => {
    const currentStation = $currentLine.timeStamps.find(
      (timeStamp) =>
        hmsToSeconds(timeStamp.startTime) <= $currentTime &&
        hmsToSeconds(timeStamp.endTime) >= $currentTime
    );
    return currentStation;
  }
);
/**
 * All lines that have a station at the currentStation. If we are not at a station, this will be undefined.
 */
export const linesAtCurrentStation = derived(
  [currentStation, currentLine, allLines],
  ([$currentStation, $currentLine, $allLines]) => {
    if (!$currentStation) return;
    return $allLines.filter((line) =>
      line.timeStamps.find(
        (timeStamp) =>
          timeStamp.name === $currentStation.name && line.id !== $currentLine.id
      )
    );
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

export const videoIsPlaying = writable<boolean>(false);
export const isImmersive = writable<boolean>(false);
export const isMuted = writable<boolean>(false);
export const isAtStation = writable<boolean>(false);
export const timeUntilNextStation = derived(
  [currentLine, currentTime, nextStation],
  ([$currentLine, $currentTime, $nextStation]) => {
    if ($nextStation) {
      const nextStartTimeString = $currentLine.timeStamps.find(
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
vimeoVideoObject.subscribe((vimeo) => {
  if (!vimeo) return;
  vimeo.on("timeupdate", function (data) {
    currentTime.set(data.seconds);
  });
});
