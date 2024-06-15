<script lang="ts">
  import { currentStation, nextStation, timeUntilNextStation } from "../store";
  import { secondsToHms } from "../utils/timeFormatter";
  let formattedTime: string;
  $: {
    formattedTime = secondsToHms($timeUntilNextStation);
  }
</script>

<div id="change-station-list">
  {$nextStation?.name}
  in {formattedTime}
  {#if $currentStation}
    <br />
    <small>Current station: {$currentStation?.name}</small>
  {/if}
</div>

<style lang="scss">
  #change-station-list {
    text-align: left;
  }
</style>
