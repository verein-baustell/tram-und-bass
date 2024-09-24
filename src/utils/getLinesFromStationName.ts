import compareStationNames from "./compareStationNames";

export default (stationName: string, allLines: Line[]) =>
  allLines.filter((line) => {
    return line.timeStamps?.find((timeStamp) =>
      compareStationNames(timeStamp.name, stationName)
    );
  });
