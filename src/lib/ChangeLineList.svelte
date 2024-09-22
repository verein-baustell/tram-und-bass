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

<div id="change-station-list" class="view detailed-view">
  {#if $currentStation == undefined}
    <div class="currentStation-change-raptor--white">
      <span>{$nextStation?.name} in</span> 
      <span class="mono-font clock">{formattedTime}</span>
    </div>
  {/if}
  {#if $currentStation}
    <div class="currentStation-change-raptor">
      <span>Umsteigen</span> 
      <img class="star" src="/images/divider.svg" alt="-"/>
      <span>{$currentStation?.name}</span>
    </div>
  {/if}
  {#if $linesAtCurrentStation}
    <LineList viewable={false} keepStationWhenChangingLine lines={$linesAtCurrentStation} />
  {/if}
</div>

<style lang="scss">
  #change-station-list {
    text-align: left;
  }

  .currentStation-change-raptor {
    display: flex;
    justify-content: center;
    width: fit-content;
    background-color: black;
    border: none;
    color: white;
    cursor: pointer;
    padding: var(--padding-ml);
    border-radius: var(--border-radius-button);
    gap: 0.5em;
    transition: var(--transition);
    font-weight: 600;

    &--white {
      background-color: white;
      color: black;

      .clock {
        border: thin solid black;
        border-radius: 3px;
        padding: 0.03em 0.35em 0.1em 0.35em;
      }
    }
  }

  .star{
    height: 0.8em;
    width: 0.8em;
    filter: invert(1);
    align-self: center;
  }

  .currentStation-change-raptor:hover{
    background-color: var(--hover-color);
    transition: var(--transition);
  }
</style>
