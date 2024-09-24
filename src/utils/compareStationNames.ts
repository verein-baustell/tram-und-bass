/**
 * check if two station names are the same ignoring whitespace and casing.
 * @param stationA a station name
 * @param stationB the station name to compare stationA with
 */
export default (stationNameA: string, stationNameB: string) =>
  stationNameA.replaceAll(" ", "").toLocaleLowerCase() ===
  stationNameB.replaceAll(" ", "").toLocaleLowerCase();
