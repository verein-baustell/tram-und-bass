// format seconds into hh:mm:ss
export const secondsToHms = (secondsToFormat: number) => {
  const hours = Math.floor(secondsToFormat / 3600);
  const minutes = Math.floor((secondsToFormat % 3600) / 60);
  const seconds = Math.floor(secondsToFormat % 60);
  if (hours === 0) {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
// format hh:mm:ss and mm:ss or ss into seconds
export const hmsToSeconds = (hms?: string) => {
  if (!hms) return 0;
  if(typeof hms === "number") return hms;
  const hmsArray = hms.split(":").map(Number);
  if (hmsArray.length === 1) return hmsArray[0];
  if (hmsArray.length === 2) return hmsArray[0] * 60 + hmsArray[1];
  const [hours, minutes, seconds] = hmsArray;
  if (isNaN(hours)) return minutes * 60 + seconds;
  return hours * 3600 + minutes * 60 + seconds;
};
