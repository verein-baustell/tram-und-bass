/**
 * Converts a station name to a station id
 * @param stationName a station name
 */
export default (stationName?: string) =>
    stationName
        ?.replaceAll(" ", "")
        .replaceAll(",", "")
        .replaceAll(".", "")
        .replaceAll("/", "")
        .replaceAll("(", "")
        .replaceAll(")", "")
        // .replaceAll("-", "")
        // .replaceAll("ö", "o")
        // .replaceAll("ä", "a")
        // .replaceAll("ü", "u")
        .replaceAll("ß", "ss")
        .toLocaleLowerCase();
