import { derived, writable } from "svelte/store";
import { hmsToSeconds } from "../utils/timeFormatter";

export const currentLine = writable<Line>();
// update query params when currentLine changes
export const currentTime = writable<number>(0);

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

          if (videoIsPlaying) return;
          vimeo
            .play()
            .then(() => {
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

export const currentStation = writable<Station>();
export const nextStation = derived(
  [currentTime, currentLine],
  ([$currentTime, $currentLine]) => {
    console.log({ $currentTime, $currentLine, timeStamps: $currentLine.timeStamps.map(({ startTime }) => hmsToSeconds(startTime))});
    const nextStation = $currentLine.timeStamps.find(
      (timeStamp) => hmsToSeconds(timeStamp.startTime) > $currentTime
    );
    return nextStation;
  })

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