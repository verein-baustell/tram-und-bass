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
