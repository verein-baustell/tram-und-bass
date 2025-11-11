<script lang="ts">
    import * as d3 from "d3";
    import { onMount, onDestroy } from "svelte";
    import {
        allLines,
        currentLine,
        currentStation,
        currentTime,
        isBtmOpen,
        isMenuMinimized,
        isMobile,
        videoIsLoading,
        currentCitySlug,
        currentCity,
    } from "../store";
    import { changeToLineAtStation } from "../utils/changeToLineAtCurrentStation";
    import getLinesFromStationName from "../utils/getLinesFromStationName";
    import getStationFromId from "../utils/getStationFromId";
    import stationNameToId from "../utils/stationNameToId";
    import { hmsToSeconds } from "../utils/timeFormatter";
    import LineList from "./LineList.svelte";
    import MapInlineSvgZurich from "./MapInlineSvgZurich.svelte";
    import MapInlineSvgChemnitz from "./MapInlineSvgChemnitz.svelte";
    import MapInlineSVG from "./MapInlineSVG.svelte";
    import LocateMe from "./LocateMe.svelte";
    type StationsPositions = { [stationId: string]: { x: number; y: number } };

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
    let selectedStationId: string | undefined;
    let selectedStationName: string | undefined | null;
    let stationPositions: StationsPositions = {};
    let linePaths: any;
    let totalLength: any;
    let segments: {
        moveDuration: number;
        stopDuration: number;
        startLength: number;
        endLength: number;
    }[] = [];
    let totalAnimationTime = 0;
    let isPathReversed = false;
    let showLineList = false;
    // ... Existing functions (zoomed, zoomToElement, highlightCurrentStation, etc.) ...
    let stationsGroupSelection = d3.select("#map-svg #stations");
    function getStationPositions() {
        const stationsGroupSelection = d3.select<SVGGElement, unknown>(
            "#map-svg #stations"
        );
        const stationPositions: StationsPositions = {};

        stationsGroupSelection.selectChildren().each(function () {
            const stationElement = d3.select(this);
            const stationId = stationElement.attr("id");
            const bbox = (this as SVGGraphicsElement).getBBox();
            let x = bbox.x + bbox.width / 2;
            let y = bbox.y + bbox.height / 2;
            const transform = stationElement.attr("transform");
            if (transform && transform.includes("matrix")) {
                const matrix = transform.match(/-?\d+/g)?.map(Number);
                if (matrix) {
                    const [a, b, c, d, e, f] = matrix;
                    x =
                        a * bbox.x +
                        bbox.width / 2 +
                        c * bbox.y +
                        bbox.height / 2 +
                        e;
                    y =
                        b * bbox.x +
                        bbox.width / 2 +
                        d * bbox.y +
                        bbox.height / 2 +
                        f;
                }
            }
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
        const samples = totalLength / 15;
        stations.forEach((station) => {
            const stationId = stationNameToId(station.stationName);
            const pos = stationPositions[stationId || ""];
            if (pos) {
                const stationX = pos.x;
                const stationY = pos.y;
                let closestLength = 0;
                let minDistance = Infinity;

                for (let i = 0; i <= samples; i++) {
                    const length = (i / samples) * totalLength;
                    const point = pathElement.getPointAtLength(length);
                    // add a cicle to the svg at the point
                    // const circle = d3.select("#map-svg > g").append("circle").attr("cx", point.x).attr("cy", point.y).attr("r", 5).attr("fill", "red").attr("class", "debug-circle");
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

        console.log("setActiveLine", newLine.id);

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
            linePaths =
                currentLineGroupSelection.selectChild<SVGPathElement>("path");
            linePaths.attr("class", "lineProgress");
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
                        startLength: currentStation.length ?? 0,
                        endLength: currentStation.length ?? 0,
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
                        startLength: startLength ?? 0,
                        endLength: endLength ?? 0,
                    });
                }
            }
            // Compute total animation time
            totalAnimationTime = segments.reduce(
                (sum: number, segment) =>
                    sum + segment.moveDuration + segment.stopDuration,
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
            if (
                stopDuration > 0 &&
                elapsedTime < accumulatedTime + stopDuration
            ) {
                // Tram is stopped at the station
                return startLength;
            }
            accumulatedTime += stopDuration;

            // Moving phase
            if (
                moveDuration > 0 &&
                elapsedTime < accumulatedTime + moveDuration
            ) {
                const moveProgress =
                    (elapsedTime - accumulatedTime) / moveDuration;
                return startLength + segmentLength * moveProgress;
            }
            accumulatedTime += moveDuration;
        }
        // Tram has reached the end
        return segments[segments.length - 1].endLength;
    }
    const getScreenPositionOfStation = (stationId: string) => {
        const stationElement = d3
            .select("#map-svg #stations")
            .selectChild("#" + stationId)
            .node() as SVGGraphicsElement;

        if (!stationElement) {
            console.warn("Station element not found for id", stationId);
            return;
        }

        // Get the bounding client rect of the station element
        const bbox = stationElement.getBoundingClientRect();

        // Calculate the center of the station element
        const x = bbox.left + bbox.width / 2;
        const y = bbox.top;

        return { x, y };
    };
    const updateLineListPosition = () => {
        if (!selectedStationId) return;

        const position = getScreenPositionOfStation(selectedStationId);

        if (!position) return;

        // Position the LineList component
        const lineListElement = document.getElementById("map-line-list");

        if (!lineListElement) return;

        lineListElement.style.left = `${position.x}px`;
        lineListElement.style.top = `${position.y}px`;
    };
    const zoomed = (event: any) => {
        const { transform } = event;
        event.sourceEvent?.stopImmediatePropagation();
        d3.select("#map-svg").selectChildren("g").attr("transform", transform);
        updateLineListPosition();
    };
    const zoom = d3
        .zoom()
        .filter((event: any) => {
            return !(!event?.ctrlKey && event?.type === "wheel");
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
        let x = bbox.x + bbox.width / 2;
        let y = bbox.y + bbox.height / 2;

        const transform = stationElement.attr("transform");
        if (transform && transform.includes("matrix")) {
            const matrix = transform.match(/-?\d+/g)?.map(Number);
            if (matrix) {
                const [a, b, c, d, e, f] = matrix;
                x =
                    a * bbox.x +
                    bbox.width / 2 +
                    c * bbox.y +
                    bbox.height / 2 +
                    e;
                y =
                    b * bbox.x +
                    bbox.width / 2 +
                    d * bbox.y +
                    bbox.height / 2 +
                    f;
            }
        }
        if (!x && !y) {
            console.error(
                "No position found for station",
                stationElement.node()
            );
            return;
        }
        const scale = 2.5;
        // translate the svg to the center of the screen on desktop and 320px above bottom for mobile
        const lineListHeight =
            document.getElementById("map-line-list")?.clientHeight;
        const topMenuHeight =
            document.getElementById("top-menu")?.clientHeight ?? 50;
        const padding = 20;
        const minDistToTop = topMenuHeight + padding;
        // const yTranslate = isMobile && lineListHeight && lineListHeight > (window.innerHeight / 2 - minDistToTop) ? INITIAL_HEIGHT - 320 : INITIAL_HEIGHT / 2;
        const yTranslate = $isMobile
            ? INITIAL_HEIGHT - 320
            : INITIAL_HEIGHT / 2;
        svg.transition()
            .duration(750)
            .call(
                zoom.transform as any,
                d3.zoomIdentity
                    .translate(INITIAL_WIDTH / 2, yTranslate)
                    .scale(scale)
                    .translate(-x, -y)
            );
    };
    const resetHighlightedStations = () => {
        stationsGroupSelection
            .selectChildren(".activeStation")
            .attr("class", "station");
    };
    const highlightCurrentStation = (newStation: string) => {
        resetHighlightedStations();

        const currentStationName = stationNameToId(newStation);
        const activeStationSelection = stationsGroupSelection.selectChild(
            "#" + currentStationName
        );
        if (activeStationSelection.node()) {
            activeStationSelection.attr("class", "activeStation station");
            zoomToElement(activeStationSelection);
        }
    };
    const activateStation = (el: SVGElement) => {
        const stationName = el.getAttribute("id");
        showLineList = true;
        resetHighlightedStations();
        el.classList.add("activeStation");
        // zoom to station
        if (!stationName || !$allLines) return;
        linesAtSelectedStation = getLinesFromStationName(
            stationName,
            $allLines
        );
        selectedStationId = stationName;
        selectedStationName = el.getAttribute("data-station-name");
        updateLineListPosition();
        zoomToElement(d3.select(el as any));
        // position lineList above the station
    };
    const addClassesToStations = () => {
        stationsGroupSelection
            .selectChildren()
            .attr("class", function () {
                const id = (this as Element)?.getAttribute("id");
                const currentStationName = stationNameToId(
                    $currentStation?.name
                );

                if (!id) return "station";
                return id === currentStationName
                    ? "activeStation station"
                    : "station";
            })
            .attr("data-station-name", function () {
                const id = (this as Element)?.getAttribute("id");
                if (!id || !$allLines) return "";
                const station = getStationFromId(id, $allLines);
                return station?.name ?? "";
            })
            .on("click", function () {
                activateStation(this as SVGElement);
            })
            .on("mouseover", function (event) {
                if ($isMobile) return;
                const stationElement = this as Element;
                const stationName = (this as Element)?.getAttribute(
                    "data-station-name"
                );
                if (!stationName) return;
                const tooltip = d3.select("#map-tooltip");
                // position the tooltip right above the station not at mouse position
                const posX =
                    stationElement.getBoundingClientRect().left +
                    stationElement.getBoundingClientRect().width / 2;
                const posY =
                    stationElement.getBoundingClientRect().top +
                    stationElement.getBoundingClientRect().height / 2;
                let innerHtml = "";
                if (stationName) {
                    innerHtml = `<div>${stationName}</div>`;
                } else {
                    innerHtml = `<div style="color:red; font-weight:bold;">No station found with id: ${(this as Element).getAttribute("id")}</div>`;
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
        stationsGroupSelection.selectChildren().attr("fill", null);
        stationsGroupSelection.selectChildren().attr("stroke", null);
    };
    onMount(() => {
        removeInlineStyleAttributes();
        stationsGroupSelection = d3.select("#map-svg #stations");
        // Get station positions
        stationPositions = getStationPositions();

        const mapSvg = d3.select<SVGElement, unknown>("#map-svg");

        // add zoom capabilities
        mapSvg.call(zoom as any);

        addClassesToStations();
        $currentLine && setActiveLine($currentLine);

        // minimize the bottom menu to make place for the locate me button
        if ($isMobile) {
            isMenuMinimized.set(true);
        }
    });

    onDestroy(() => {
        if ($isMobile) {
            isMenuMinimized.set(false);
        }
    });

    currentStation.subscribe((newStation) => {
        if (newStation?.name && !selectedStationId) {
            highlightCurrentStation(newStation.name);
        }
    });

    currentLine.subscribe((newLine) => {
        newLine && setActiveLine(newLine);
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
            dashOffset = -tramPosition + 4 * totalLength;
        } else {
            dashOffset = -totalLength - tramPosition;
        }

        linePaths
            .transition()
            .duration(300)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", dashOffset);
    });

    const locateMe = (newStationName?: string) => {
        console.log("locate me", newStationName);
        const stationId = stationNameToId(newStationName);
        if (newStationName) {
            activateStation(d3.select(`#${stationId}`).node() as SVGElement);
        }
    };
</script>

{#if linesAtSelectedStation && showLineList}
    <LineList
        hasRecoveryButton={false}
        id="map-line-list"
        onClick={(lineClicked) => {
            selectedStationId &&
                changeToLineAtStation(lineClicked, selectedStationId);
        }}
        lines={linesAtSelectedStation}
        isClosable
        onClose={() => {
            selectedStationId = undefined;
            showLineList = false;
            resetHighlightedStations();
        }}
        title={selectedStationName}
    />
{/if}

<div id="map">
    <svg
        id="map-svg"
        viewBox="0 0 2560 2560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class={$videoIsLoading ? "isLoading" : ""}
        ><g>
            {#if $currentCity?.map}
                <MapInlineSVG mapData={$currentCity.map} />
            {:else if $currentCitySlug === "zurich"}
                <MapInlineSvgZurich />
            {:else if $currentCitySlug === "chemnitz"}
                <MapInlineSvgChemnitz />
            {/if}
        </g>
    </svg>
    <div id="map-tooltip" class="isActive">a</div>
    <LocateMe onLocationFound={locateMe} />
</div>

<style lang="scss" scoped>
    :global(#map-line-list) {
        position: fixed;
        z-index: 99999;
        top: 50%;
        left: 50%;
        transform: translate(-50%, calc(-100% - 1.5em));
        height: min-content;
        overflow: hidden;
        :global(ul) {
            max-height: 300px;
            overflow-y: scroll;
            overflow-x: hidden;
            @media (max-width: 768px) {
                max-height: 230px;
            }
        }
    }
    :global(.isLoading) {
        :global(.activeLine) {
            :global(.lineProgress) {
                opacity: 0;
            }
            :global(path:not(.lineProgress)) {
                animation: pulse 0.6s ease-in-out infinite alternate;
                stroke-dasharray: 50;

                @keyframes pulse {
                    from {
                        stroke-dashoffset: -50;
                    }
                    to {
                        stroke-dashoffset: 50;
                    }
                }
            }
        }
    }
    #map {
        z-index: -1;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba($color: #ffffff, $alpha: 0.8);
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
    :global(#water) {
        fill: rgb(141, 181, 255);
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
        :global(path:not(.lineProgress)) {
            stroke-dasharray: 0;
            transition: all 0.6s ease;
        }
        :global(path) {
            transition: opacity 0.6s ease;
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
