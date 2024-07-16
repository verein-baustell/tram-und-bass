<script lang="ts">
  import { onMount } from "svelte";
  import MapInlineSvg from "./MapInlineSvg.svelte";
  import * as d3 from "d3";
  const INITIAL_WIDTH = 2560;
  const INITIAL_HEIGHT = 2560;
  const EXTENT_PADDING = 400;
  onMount(() => {
    const mapSvg = d3.select<SVGElement, unknown>("#map-svg");
    // add zoom capabilities
    const zoomed = (event: any) => {
      console.log(event);
      const { transform } = event;
      event.sourceEvent?.stopImmediatePropagation();
      d3.select("#map-svg").selectChildren('g').attr("transform", transform);
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
  });
</script>

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

<style lang="scss">
  #map {
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
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
</style>
