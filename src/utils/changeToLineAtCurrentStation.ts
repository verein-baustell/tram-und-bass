import { get } from "svelte/store";
import {
  currentStation,
  currentLine,
  timeToSeekAfterVideoLoad,
} from "../store";
import { hmsToSeconds } from "./timeFormatter";
/**
 * Change the current line at the current station. This will change the currentTime of the new video after it is loaded to be at the same station again.
 * @param line The line to change to.
 */
export const changeToLineAtCurrentStation = (line: Line) => {
  if (!currentStation) return;
  let stationNameToKeep = get(currentStation)?.name;
  if (!stationNameToKeep) {
    console.error("No station name to change to");
    return;
  }
  const timeStampOfCurrentStation = hmsToSeconds(
    line.timeStamps.find((timeStamp) => timeStamp?.name === stationNameToKeep)
      ?.startTime
  );
  !isNaN(timeStampOfCurrentStation) &&
    timeToSeekAfterVideoLoad.set(timeStampOfCurrentStation);
  currentLine.set(line);
};
