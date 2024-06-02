import { writable } from "svelte/store";

export const currentLine = writable<Line>();
// update query params when currentLine changes
currentLine.subscribe((value) => {
  if (value && typeof window !== "undefined") {
    const url = new URL(window.location.href);
    url.searchParams.set("line", value.id);
    window.history.replaceState(null, "", url.toString());
  }
});
export const currentStation = writable<Station>();
export const nextStation = writable<Station>();
export const vimeoVideoObject = writable<Vimeo>();
export const videoIsPlaying = writable<boolean>(false);
export const isImmersive = writable<boolean>(false);
export const isMuted = writable<boolean>(false);
export const isAtStation = writable<boolean>(false);
