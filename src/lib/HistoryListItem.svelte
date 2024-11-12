<script lang="ts">
  import { isTopOpen } from "../store";
  import { recoverState } from "../utils/stateManager";
  import { changeToLineAtTime } from "../utils/changeToLineAtCurrentTime";

  export let state: State;
  export let index: number;

  // Function to format time
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    return `${String(minutes)}'`;
  }
</script>

<button
  on:click={() => {
    const newState = recoverState(index);
    if (newState) {
      changeToLineAtTime(newState.line, newState.time);
      isTopOpen.set(false);
    }
    return; // Explicitly return to match the handler type.
  }}
>
  <p>{state.line?.number}</p>

  <!-- Show 'name' by default and 'artistName' on hover -->
  <p class="name default">{state.line?.name}</p>
  <p class="name hover">{state.line?.artistName}</p>

  <span>
    <img src="/images/arrow.svg" alt="Arrow" />
  </span>

  <p class="time">{formatTime(state.time)}</p>
</button>

<style lang="scss" scoped>
  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin: 0.1em;
    background-color: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: "HoloMono";
    font-size: 15px;
    color: white;

    p {
      margin: 0;
      padding: 0;
      // font-size: 1em;
      // color: black;
    }

    // Number container
    & > p:first-child {
      flex: 0 0 20px; // fixed width on the left for the number
      // font-weight: bold;
      text-align: right;
    }

    // Name container, showing different text on hover
    & .name.default {
      padding-left: 5px;
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    & .name.hover {
      padding-left: 5px;
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: none;
    }

    // Show artist name on hover
    &:hover .name.default {
      display: none;
    }
    &:hover .name.hover {
      display: block;
    }

    // Time and arrow container
    span {
      display: flex;
      align-items: center;
      flex: 0 0 5%;
      justify-content: flex-end;

      // Initially hide the arrow
      img {
        height: 1em;
        margin-left: 0.5em; // space between time and arrow
        opacity: 0;
        transition: opacity 0.2s ease;
        filter: invert(1);
      }
    }

    // Show the arrow on hover
    &:hover span img {
      opacity: 1;
    }
    .time {
      margin: 0;
      padding: 0;
      flex: 0 0 35px;
      text-align: right;
    }
  }

  /* Media query for mobile */
  @media (max-width: 600px) {
    button {
      padding: 0.15em 0.4em;
    }
  }
</style>
