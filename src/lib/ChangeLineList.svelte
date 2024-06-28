<script lang="ts">
  import {
    currentStation,
    linesAtCurrentStation,
    nextStation,
    timeUntilNextStation,
  } from "../store";
  import { secondsToHms } from "../utils/timeFormatter";
  import LineList from "./LineList.svelte";
  let formattedTime: string;
  $: {
    formattedTime = secondsToHms($timeUntilNextStation);
  }
</script>

<div id="change-station-list">
  {$nextStation?.name}
  in <span class="mono-font">{formattedTime}</span>
  {#if $currentStation}
    <br />
    <small>Current station: {$currentStation?.name}</small>
  {/if}
  {#if $linesAtCurrentStation}
    <LineList keepStationWhenChangingLine lines={$linesAtCurrentStation} />
  {/if}
</div>

<style lang="scss">
  #change-station-list {
    text-align: left;
  }
</style>
