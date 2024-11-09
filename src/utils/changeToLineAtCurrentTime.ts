import { get } from "svelte/store";
import {
  currentStation,
  currentLine,
  timeToSeekAfterVideoLoad,
  vimeoVideoObject
} from "../store";
import compareStationNames from "./compareStationNames";
import { hmsToSeconds } from "./timeFormatter";
/**
 * Change the current line at a station. This will change the currentTime of the new video after it is loaded to be at the specified station.
 * @param line The line to change to.
 */
export const changeToLineAtTime = (line: Line | undefined, newTime: number) => {
  if (line == undefined) return;
  const isSameLine = get(currentLine)?.id === line.id;
  if (isSameLine) {
    console.log('same line')
    const vimeo = get(vimeoVideoObject)
    vimeo.setCurrentTime(newTime);
    vimeo.play();
    return;
  }
  else (newTime) &&
    timeToSeekAfterVideoLoad.set(newTime);
  currentLine.set(line);
};
