<script lang="ts">
  import { onMount } from "svelte";
  import MapInlineSvg from "./MapInlineSvg.svelte";
  import * as d3 from "d3";
  import { currentLine, currentStation, currentTime, allLines } from "../store";
  import { hmsToSeconds } from "../utils/timeFormatter";
  import { changeToLineAtStation } from "../utils/changeToLineAtCurrentStation";
  import getLinesFromStationName from "../utils/getLinesFromStationName";
  import LineList from "./LineList.svelte";
  type StationsPositions = { [stationId: string]: { x: number; y: number } };
  import compareStationNames from "../utils/compareStationNames";
  import stationNameToId from "../utils/stationNameToId";
  const INITIAL_WIDTH = 2560;
  const INITIAL_HEIGHT = 2560;
  const EXTENT_PADDING = 400;
  let currentLineGroupSelection: d3.Selection<
    SVGGElement,
    unknown,
    HTMLElement,
    any
  >;
  let linesAtSelectedStation: Line[]; // the station that is currently being previewed
  let selectedStation: string;
  let stationPositions: StationsPositions = {};
  let linePaths: any;
  let totalLength: any;
  let segments: any = [];
  let totalAnimationTime = 0;
  let isPathReversed = false;
  // ... Existing functions (zoomed, zoomToElement, highlightCurrentStation, etc.) ...

  function getStationPositions() {
    const stationsGroupSelection = d3.select<SVGGElement, unknown>(
      "#map-svg #stations"
    );
    const stationPositions: StationsPositions = {};

    stationsGroupSelection.selectChildren().each(function () {
      const stationElement = d3.select(this);
      const stationId = stationElement.attr("id");
      const bbox = (this as SVGGraphicsElement).getBBox();
      const x = bbox.x + bbox.width / 2;
      const y = bbox.y + bbox.height / 2;

      stationPositions[stationId] = { x, y };
    });

    return stationPositions;
  }

  function getStationLengthsAlongPath(
    pathElement: SVGPathElement,
    stationPositions: StationsPositions,
    stations: {
      stationName: any;
      arrivalTime: number;
      departureTime: number;
    }[]
  ) {
    const totalLength = pathElement.getTotalLength();
    const stationLengths: {
      stationName: string;
      length: number;
    }[] = [];

    stations.forEach((station) => {
      const stationId = station.stationName.replaceAll(" ", "").toLowerCase();
      const pos = stationPositions[stationId];
      if (pos) {
        const stationX = pos.x;
        const stationY = pos.y;
        let closestLength = 0;
        let minDistance = Infinity;
        const samples = 1000;
        for (let i = 0; i <= samples; i++) {
          const length = (i / samples) * totalLength;
          const point = pathElement.getPointAtLength(length);
          const dx = point.x - stationX;
          const dy = point.y - stationY;
          const distance = Math.hypot(dx, dy);
          if (distance < minDistance) {
            minDistance = distance;
            closestLength = length;
          }
        }
        stationLengths.push({
          stationName: station.stationName,
          length: closestLength,
        });
      } else {
        console.warn("Station position not found for", stationId);
      }
    });

    return stationLengths;
  }

  function setActiveLine(newLine: Line) {
    // first reset all lines
    d3.select("#map-svg #lines")
      .selectChildren()
      .selectChildren()
      .attr("class", null)
      .attr("stroke", null);

    const groupSelection = d3.select<SVGGElement, unknown>(
      "#map-svg #lines #" + newLine.id
    );
    groupSelection
      .attr("class", "activeLine")
      .attr("stroke", newLine.color)
      .raise();

    if (groupSelection) {
      currentLineGroupSelection = groupSelection;

      // Select the path(s) of the line
      linePaths = currentLineGroupSelection.selectChild<SVGPathElement>("path");

      // Get the total length
      const pathElement = linePaths.node();
      if (!pathElement) {
        console.error("No path element found for line", newLine.id);
        return;
      }
      totalLength = pathElement.getTotalLength();

      // Get the station positions for the current line
      const timeStamps = newLine.timeStamps; // Array of { stationName, arrivalTime, departureTime }
      if (!timeStamps) return;
      // Process timeStamps to get times in seconds
      const stations: {
        stationName: string;
        arrivalTime: number;
        departureTime: number;
        length?: number;
      }[] = timeStamps.map((ts) => {
        return {
          stationName: ts.name,
          arrivalTime: hmsToSeconds(ts.startTime),
          departureTime: hmsToSeconds(ts.endTime),
        };
      });

      // Get lengths along the path for each station
      const stationLengths = getStationLengthsAlongPath(
        pathElement,
        stationPositions,
        stations
      );

      // Add lengths to stations
      stations.forEach((s) => {
        const stationLength = stationLengths.find(
          (sl) => sl.stationName === s.stationName
        )?.length;
        s.length = stationLength;
      });
      // the path is reversed if the path was drawn from the last station to the first
      // to check this we compare the position of the first station to the position of the beginning of the path
      if (stationPositions) {
        const beginningOfPathPos = pathElement.getPointAtLength(0);
        const stationId = stationNameToId(stations[0].stationName);
        if (stationId) {
          const firstStationPos = stationPositions?.[stationId];
          if (firstStationPos) {
            const distance = Math.hypot(
              beginningOfPathPos.x - firstStationPos.x,
              beginningOfPathPos.y - firstStationPos.y
            );
            isPathReversed = distance > 50;
          }
        }
      }
      // (stations?.[0]?.length ?? 0) >
      // (stations?.[stations.length - 1]?.length ?? 0);

      // if (isPathReversed) {
      //   // Invert station lengths
      //   stations.forEach((s) => {
      //     s.length = totalLength - (s?.length ?? 0);
      //   });
      // }

      // Compute segments
      segments = [];
      for (let i = 0; i < stations.length; i++) {
        const currentStation = stations[i];

        // Process stop duration at current station
        const stopDuration =
          currentStation.departureTime - currentStation.arrivalTime;
        if (stopDuration > 0) {
          segments.push({
            moveDuration: 0,
            stopDuration: stopDuration,
            startLength: currentStation.length,
            endLength: currentStation.length,
          });
        }

        // Process move duration to next station
        const nextStation = stations[i + 1];
        if (nextStation) {
          const moveDuration =
            nextStation.arrivalTime - currentStation.departureTime;
          const startLength = currentStation.length;
          const endLength = nextStation.length;

          segments.push({
            moveDuration: moveDuration,
            stopDuration: 0,
            startLength: startLength,
            endLength: endLength,
          });
        }
      }
      // Compute total animation time
      totalAnimationTime = segments.reduce(
        (sum, segment) => sum + segment.moveDuration + segment.stopDuration,
        0
      );
      let strokeOffset = 0;
      // Initialize the line path for animation
      if (isPathReversed) {
        strokeOffset = totalLength + (stations[0]?.length ?? 0);
      } else {
        strokeOffset = stations[0]?.length ?? 0;
      }
      linePaths
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", strokeOffset);
    }
  }

  function getTramPosition(elapsedTime: number) {
    let accumulatedTime = 0;
    for (let i = 0; i < segments.length; i++) {
      const { moveDuration, stopDuration, startLength, endLength } =
        segments[i];
      const segmentLength = endLength - startLength;

      // Stopping phase
      if (stopDuration > 0 && elapsedTime < accumulatedTime + stopDuration) {
        // Tram is stopped at the station
        return startLength;
      }
      accumulatedTime += stopDuration;

      // Moving phase
      if (moveDuration > 0 && elapsedTime < accumulatedTime + moveDuration) {
        const moveProgress = (elapsedTime - accumulatedTime) / moveDuration;
        return startLength + segmentLength * moveProgress;
      }
      accumulatedTime += moveDuration;
    }
    // Tram has reached the end
    return segments[segments.length - 1].endLength;
  }

  const zoomed = (event: any) => {
    const { transform } = event;
    event.sourceEvent?.stopImmediatePropagation();
    d3.select("#map-svg").selectChildren("g").attr("transform", transform);
  };
  const zoom = d3
    .zoom()
    .filter((event) => {
      const isTouchScrolling =
        event?.type === "touchstart" && event?.touches.length === 1;

      return !(!event?.ctrlKey && event?.type === "wheel") && !isTouchScrolling;
    })
    .scaleExtent([1, 5])
    .translateExtent([
      [0 - EXTENT_PADDING, 0 - EXTENT_PADDING],
      [INITIAL_WIDTH + EXTENT_PADDING, INITIAL_HEIGHT + EXTENT_PADDING],
    ])
    .on("zoom", zoomed);
  const zoomToElement = (
    stationElement: d3.Selection<d3.BaseType, any, any, any>
  ) => {
    const svg = d3.select("#map-svg");
    const bbox = (stationElement.node() as SVGGElement).getBBox();
    const x0 = bbox.x;
    const y0 = bbox.y;
    const x1 = bbox.x + bbox.width;
    const y1 = bbox.y + bbox.height;
    const scale = 4;
    svg
      .transition()
      .duration(750)
      .call(
        zoom.transform as any,
        d3.zoomIdentity
          .translate(INITIAL_WIDTH / 2, INITIAL_HEIGHT / 2)
          .scale(scale)
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
      );
  };
  const highlightCurrentStation = (newStation: string) => {
    const stationsGroupSelection = d3.select("#map-svg #stations");
    stationsGroupSelection
      .selectChildren(".activeStation")
      .attr("class", "station");
    const currentStationName = newStation
      .replaceAll(" ", "")
      .toLocaleLowerCase();
    const activeStationSelection = stationsGroupSelection.selectChild(
      "#" + currentStationName
    );
    if (activeStationSelection.node()) {
      activeStationSelection.attr("class", "activeStation station");
      zoomToElement(activeStationSelection);
    }
  };
  const addClassesToStations = () => {
    const stationsGroupSelection = d3.select("#map-svg #stations");
    stationsGroupSelection
      .selectChildren()
      .attr("class", function () {
        const id = (this as Element)?.getAttribute("id");
        const currentStationName = stationNameToId($currentStation?.name);

        if (!id) return "station";
        return id === currentStationName ? "activeStation station" : "station";
      })
      .on("click", function () {
        const stationName = (this as Element)?.getAttribute("id");
        stationsGroupSelection
          .selectChildren(".activeStation")
          .attr("class", "station");
        (this as Element).classList.add("activeStation");
        // zoom to station
        zoomToElement(d3.select(this));
        if (!stationName) return;
        linesAtSelectedStation = getLinesFromStationName(
          stationName,
          $allLines
        );
        selectedStation = stationName;
      })
      .on("mouseover", function (d, e) {
        const stationElement = this as Element;
        const stationName = (this as Element)?.getAttribute("id");
        if (!stationName) return;
        const line = $allLines.find((line) =>
          line.timeStamps?.find((timeStamp) =>
            compareStationNames(timeStamp.name, stationName)
          )
        );
        const station = line?.timeStamps?.find((timeStamp) =>
          compareStationNames(timeStamp.name, stationName)
        );
        const tooltip = d3.select("#map-tooltip");
        // position the tooltip right above the station not at mouse position
        const posX =
          stationElement.getBoundingClientRect().left +
          stationElement.getBoundingClientRect().width / 2;
        const posY =
          stationElement.getBoundingClientRect().top +
          stationElement.getBoundingClientRect().height / 2;
        let innerHtml = "";
        if (station) {
          innerHtml = `<div>${station?.name}</div>`;
        } else {
          innerHtml = `<div style="color:red; font-weight:bold;">No station found with id: ${stationName}</div>`;
        }
        tooltip
          .style("opacity", 1)
          .style("left", `${posX}px`)
          .style("top", `${posY}px`)
          .html(innerHtml);
      })
      .on("mouseout", function () {
        const tooltip = d3.select("#map-tooltip");
        tooltip.style("opacity", 0);
      });
    if (currentStation) {
      const activeStationSelection =
        stationsGroupSelection.selectChild(".activeStation");
      // check if seletion is not empty
      if (activeStationSelection && activeStationSelection.node()) {
        zoomToElement(activeStationSelection as any);
      }
    }
  };
  const removeInlineStyleAttributes = () => {
    const stationsGroupSelection = d3.select("#map-svg #stations");
    stationsGroupSelection.selectChildren().attr("fill", null);
    stationsGroupSelection.selectChildren().attr("stroke", null);
  };
  onMount(() => {
    removeInlineStyleAttributes();

    // Get station positions
    stationPositions = getStationPositions();

    const mapSvg = d3.select<SVGElement, unknown>("#map-svg");

    // add zoom capabilities
    mapSvg.call(zoom as any);

    addClassesToStations();
    setActiveLine($currentLine);
  });

  currentStation.subscribe((newStation) => {
    newStation?.name && highlightCurrentStation(newStation.name);
  });

  currentLine.subscribe((newLine) => {
    setActiveLine(newLine);
  });

  currentTime.subscribe((newTime) => {
    if (!linePaths || segments.length === 0) {
      return;
    }

    const elapsedTime = newTime;
    const tramPosition = getTramPosition(elapsedTime);
    let dashOffset: number;
    if (isPathReversed) {
      // no fucking idea why 4 times the totalLength but it works
      dashOffset = -tramPosition + 4*totalLength;
    } else {
      dashOffset = -totalLength - tramPosition;
    }

    linePaths
      .transition()
      .duration(300)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", dashOffset);
  });
</script>

{#if linesAtSelectedStation}
  <LineList
    onClick={(lineClicked) => {
      changeToLineAtStation(lineClicked, selectedStation);
    }}
    lines={linesAtSelectedStation}
  />
{/if}

<div id="map">
  <svg
    id="map-svg"
    viewBox="0 0 2560 2560"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <MapInlineSvg />
  </svg>
  <div id="map-tooltip" class="isActive">a</div>
</div>

<style lang="scss" scoped>
  #map {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #ffffff, $alpha: 0.2);
    backdrop-filter: blur(20px);
    /* opacity: 0.9; */
    animation: fadeIn 0.8s ease-in-out;
    @keyframes fadeIn {
      from {
        backdrop-filter: blur(0px);
      }
      to {
        backdrop-filter: blur(20px);
      }
    }
  }
  #map-svg {
    width: 100%;
    height: 100%;
  }
  :global(.station) {
    stroke: var(--foreground-color);
    fill: var(--background-color);
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
      stroke-width: 32px;
    }
  }
  :global(.activeStation) {
    stroke-width: 12px;
  }
  :global(.activeLine) {
    :global(path) {
      stroke: inherit; // TODO make this the color of the line
    }
  }
  #map-tooltip {
    position: absolute;
    pointer-events: none;
    background-color: var(--background-color);
    border-radius: var(--border-radius-view);
    padding: var(--padding-view);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    transform: translate(-50%, calc(-1em - 100%));
    opacity: 0;
  }
</style>
