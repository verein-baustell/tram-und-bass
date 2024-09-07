<script lang="ts">
  import { onMount } from "svelte";
  import MapInlineSvg from "./MapInlineSvg.svelte";
  import * as d3 from "d3";
  import { currentLine, currentStation, currentTime, allLines } from "../store";
  import { hmsToSeconds } from "../utils/timeFormatter";
  import { changeToLineAtCurrentStation } from "../utils/changeToLineAtCurrentStation";
  import getLinesFromStationName from "../utils/getLinesFromStationName";
  import LineList from "./LineList.svelte";
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
  const addClassesToStations = () => {
    const stationsGroupSelection = d3.select("#map-svg #stations");
    console.log({ stationsGroupSelection });
    stationsGroupSelection.selectChildren().attr("class", function () {
      const id = (this as Element)?.getAttribute("id");
      const currentStationName = $currentStation?.name.replaceAll(" ", "").toLocaleLowerCase();

      if (!id) return "station";
      if (id === currentStationName) {
        console.log("activeStation found:", id);
      }
      return id === currentStationName ? "activeStation" : "station";
    }).on("click", function () {
      const stationName = (this as Element)?.getAttribute("id");
      console.log("station clicked", stationName);
      if(!stationName) return;
      linesAtSelectedStation = getLinesFromStationName(
        stationName,
        $allLines,
      ); 
      console.log({linesAtSelectedStation});
    });
  };
  const removeInlineStyleAttributes = () => {
    const stationsGroupSelection = d3.select("#map-svg #stations");
    stationsGroupSelection.selectChildren().attr("fill", null);
    stationsGroupSelection.selectChildren().attr("stroke", null);
  };
  const setActiveLine = (newLine: Line) => {
    console.log("currentLine changed", "#map-svg #lines #" + newLine.id);
    const groupSelection = d3.select<SVGGElement, unknown>(
      "#map-svg #lines #" + newLine.id
    );
    groupSelection.attr("class", "activeLine").attr("stroke", newLine.color);
    if (groupSelection) {
      currentLineGroupSelection = groupSelection;
      const linePaths =
        currentLineGroupSelection.selectChild<SVGPathElement>("path");
      // add animation to line. Make the line animate linear from station to station
      const totalLength = linePaths.node()?.getTotalLength();
      console.log({ linePaths, totalLength });

      if (totalLength) {
        const durationOfLine =
          hmsToSeconds(newLine.timeStamps?.at(-1)?.startTime) + hmsToSeconds(newLine.timeStamps?.at(0)?.endTime) ?? 0;

        const currentProgressInPercent = $currentTime / durationOfLine;
        const currentProgressInPixels = totalLength * currentProgressInPercent;
        linePaths
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength - currentProgressInPixels)
          .transition()
          .duration(
            +(1000 * durationOfLine ?? 0)
          )
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      }
    }
  };
  onMount(() => {
    removeInlineStyleAttributes();
    const mapSvg = d3.select<SVGElement, unknown>("#map-svg");
    // add zoom capabilities
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

        return (
          !(!event?.ctrlKey && event?.type === "wheel") && !isTouchScrolling
        );
      })
      .scaleExtent([1, 5])
      .translateExtent([
        [0 - EXTENT_PADDING, 0 - EXTENT_PADDING],
        [INITIAL_WIDTH + EXTENT_PADDING, INITIAL_HEIGHT + EXTENT_PADDING],
      ])
      .on("zoom", zoomed);
    mapSvg.call(zoom as any);

    addClassesToStations();
    setActiveLine($currentLine);
  });

  currentStation.subscribe(() => {
    console.log("currentStation changed");
    addClassesToStations();
  });
  currentLine.subscribe((newLine) => {
    setActiveLine(newLine);
  });
  currentTime.subscribe(() => {});
</script>
{#if linesAtSelectedStation}<LineList lines={linesAtSelectedStation} />{/if}
<div id="map">
  <svg
    id="map-svg"
    viewBox="0 0 2560 2560"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <MapInlineSvg />
  </svg>
</div>

<style lang="scss" scoped>
  #map {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #FFFFFF, $alpha: 0.8);
    backdrop-filter: blur(40px);
    animation: fadeIn 0.8s ease-in-out;
    @keyframes fadeIn {
      from {
        backdrop-filter: blur(0px);
      }
      to {
        backdrop-filter: blur(40px);
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
    fill: green;
  }
  :global(.activeLine) {
    :global(path) {
      stroke: inherit; // TODO make this the color of the line
    }
  }
</style>
