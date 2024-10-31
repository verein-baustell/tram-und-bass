import { get } from "svelte/store";
import {
  currentStation,
  currentLine,
  timeToSeekAfterVideoLoad,
  vimeoVideoObject,
  videoIsLoading,
} from "../store";
import compareStationNames from "./compareStationNames";
import { hmsToSeconds } from "./timeFormatter";
/**
 * Change the current line at a station. This will change the currentTime of the new video after it is loaded to be at the specified station.
 * @param line The line to change to.
 */
export const changeToLineAtStation = (line: Line, stationName: string) => {
  if (!currentStation) return;
  if (!stationName) {
    console.error("No station name to change to");
    return;
  }
  console.log("🚉 change to line:", line.name, "at station:", stationName);
  const timeStampOfCurrentStation = hmsToSeconds(
    line?.timeStamps?.find((timeStamp) =>
      compareStationNames(timeStamp.name, stationName)
    )?.startTime
  );
  const isSameLine = get(currentLine).id === line.id;
  if (isSameLine) {
    get(vimeoVideoObject).setCurrentTime(timeStampOfCurrentStation);
    return;
  }
  !isNaN(timeStampOfCurrentStation) &&
    timeToSeekAfterVideoLoad.set(timeStampOfCurrentStation);
  currentLine.set(line);
};
