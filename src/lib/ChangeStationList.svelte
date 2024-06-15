<script lang="ts">
  import { currentTime, nextStation, timeUntilNextStation } from "../store";
  import { secondsToHms } from "../utils/timeFormatter";
  let formattedTime: string;

  $: {
    formattedTime = secondsToHms($timeUntilNextStation);
  }
</script>

<div>
  timeUntilNextStation: {formattedTime}<br />
  currentTime: {$currentTime}
  nextStation: {$nextStation?.name}
  ChangeStationList
</div>
