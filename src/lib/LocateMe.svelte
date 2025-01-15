<script lang="ts">
  import stationNamesWithCoords from "../data/stationNamesWithCoords.json";
  import { isMenuMinimized } from "../store";
  import Button from "./Button.svelte";
  type StationWithCoords = { name: string; lat: number; lng: number };
  export let onLocationFound: (
    newStationName?: StationWithCoords["name"]
  ) => void;
  const getNearestStation = (
    lat: number,
    lng: number
  ): StationWithCoords | null => {
    let nearestStation: StationWithCoords | null = null;
    let nearestDistance = Infinity;
    for (const station of stationNamesWithCoords) {
      const distance = Math.sqrt(
        (station.lat - lat) ** 2 + (station.lng - lng) ** 2
      );
      if (distance < nearestDistance) {
        nearestStation = station;
        nearestDistance = distance;
      }
    }
    return nearestStation;
  };

  const locateUser = () => {
    // use navigator.geolocation.getCurrentPosition
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const nearestStation = getNearestStation(lat, lng);
      onLocationFound(nearestStation?.name);
    });
  };
</script>

{#if $isMenuMinimized}
  <Button
    id="locate-me-button"
    on:click={() => {
      locateUser();
    }}
  >
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="27" cy="27" r="8" stroke="black" stroke-width="8" />
      <circle cx="27" cy="6" r="6" fill="black" />
      <circle cx="48" cy="27" r="6" fill="black" />
      <circle cx="27" cy="48" r="6" fill="black" />
      <circle cx="6" cy="27" r="6" fill="black" />
    </svg>
  </Button>
{/if}

<style lang="scss">
  :global(#locate-me-button) {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 3;
    margin: var(--global-padding);
    white-space: nowrap;
    /* display: flex;
    align-items: center;
    gap: 0.5em; */
    @media (min-width: 768px) {
      display: none;
    }
  }
</style>
