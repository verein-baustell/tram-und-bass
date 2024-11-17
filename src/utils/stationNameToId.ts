/**
 * Converts a station name to a station id
 * @param stationName a station name
 */
export default (stationName?: string) =>
  stationName
    ?.replaceAll(" ", "")
    .replaceAll(",", "")
    .replaceAll(".", "")
    .toLocaleLowerCase();
