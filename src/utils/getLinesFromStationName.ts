export default (stationName: string, allLines: Line[]) =>
  allLines.filter((line) => {
    return line.timeStamps?.find((timeStamp) => timeStamp.name.toLocaleLowerCase() === stationName.toLocaleLowerCase() );
  });
