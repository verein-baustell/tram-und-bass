import {
  currentStation,
  currentLine,
  timeToSeekAfterVideoLoad,
} from "../store";
import compareStationNames from "./compareStationNames";
import { hmsToSeconds } from "./timeFormatter";
/**
 * Change the current line at a station. This will change the currentTime of the new video after it is loaded to be at the specified station.
 * @param line The line to change to.
 */
export const changeToLineAtStation = (line: Line, stationName: string) => {
  console.log("Changing to line", line,"at station", stationName);
  if (!currentStation) return;
  if (!stationName) {
    console.error("No station name to change to");
    return;
  }
  const timeStampOfCurrentStation = hmsToSeconds(
    line?.timeStamps?.find((timeStamp) =>
      compareStationNames(timeStamp.name, stationName)
    )?.startTime
  );
  !isNaN(timeStampOfCurrentStation) &&
    timeToSeekAfterVideoLoad.set(timeStampOfCurrentStation);
  currentLine.set(line);
};
