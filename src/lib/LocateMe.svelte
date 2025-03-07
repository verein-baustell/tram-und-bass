<script lang="ts">
  import stationNamesWithCoords from "../data/stationNamesWithCoords.json";
  import { isMenuMinimized } from "../store";
  import Button from "./Button.svelte";
  type StationWithCoords = { name: string; lat: number; lng: number };
  export let onLocationFound: (
    newStationName?: StationWithCoords["name"]
  ) => void;
  let showErrorMessage = false;
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
  let timeoutId: number
  const locateUser = () => {
    // use navigator.geolocation.getCurrentPosition
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const nearestStation = getNearestStation(lat, lng);
        onLocationFound(nearestStation?.name);
      },
      (error) => {
        console.error(error);
        showErrorMessage = true;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          showErrorMessage = false;
        }, 4000);
      },
      { enableHighAccuracy: true }
    );
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

{#if showErrorMessage}
  <modal id="locate-me-error-modal" >
    <p>Bitte erlaube die <b>Ortungsdienste</b> für diesen Browser.</p>
  </modal>
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
  #locate-me-error-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    background-color: white;
    padding: 1em;
    border-radius: var(--border-radius-view);
    border: 1px solid var(--background-color-light);
    animation: fadeOut 1s 3s ease-in-out;
    animation-fill-mode: forwards;
    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
      to {
        opacity: 0;
        filter: blur(10px);
      }
    }
  }
</style>

