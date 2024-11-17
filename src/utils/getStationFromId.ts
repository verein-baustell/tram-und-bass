import compareStationNames from "./compareStationNames";

export default (stationName: string, allLines: Line[]) => {
    const line = allLines.find((line) =>
        line.timeStamps?.find((timeStamp) =>
            compareStationNames(timeStamp.name, stationName)
        )
    );
    const station = line?.timeStamps?.find((timeStamp) =>
        compareStationNames(timeStamp.name, stationName)
    );
    return station;
}
