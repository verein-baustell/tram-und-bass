<script lang="ts">
  import { currentLine, isMobile, isTopOpen } from "../store";
  import LineNumber from "./LineNumber.svelte";
  export let onClick: (lineClicked: Line) => void;
  export let line: Line;
  const releaseDate = new Date(line.releaseDate);
  const formattedDate = releaseDate.toLocaleDateString('en-GB').replace(/\//g, '.');
  
</script>

<li>
  <button
    on:click={() => line.isReleased && onClick(line)}
    disabled={!line.isReleased}
    on:keydown={(e) => {
      if (e.key === "Enter" && line.isReleased) {
        onClick(line);
      }
    }}
    class:isActive={$currentLine === line}
  >
    <LineNumber number={line.number} />
    <span>{line.name}</span>
    <img class="star" src="/images/divider.svg" alt="-" />
    {#if line.artistName === "Endstation Altes Krematorium" && $isMobile === true && $isTopOpen === true}
      <div style="overflow: hidden">
        <div class="marquee">{line.isReleased?line.artistName:"coming soon"}</div>
      </div>
    {:else}
      <p>{line.isReleased?line.artistName:"coming soon"}</p>
    {/if}
    <p class="releaseDate">{formattedDate}</p>
  </button>
</li>

<style lang="scss" scoped>
 
  button {
    position: relative;
    &:disabled{
      opacity: 0.5;
      cursor: help;
      img, p {
        filter: blur(3px);
      }
      &:hover {
        .releaseDate {
          display: flex;
          position: absolute;
          right: 4px;
          filter: blur(0px);
          padding: 1px 4px 1px 4px;
          border: thin solid black;
          border-radius: 4px;
        }
      }
    }
    .marquee {
      overflow: hidden;
      white-space: nowrap;
      box-sizing: border-box;
      animation: marquee 10s ease-in-out infinite;
    }

    @keyframes marquee {
      0% {
        transform: translateX(0%);
      }
      50% {
        transform: translateX(-5%);
      }
      100% {
        transform: translateX(0%);
      }
    }
    .releaseDate{
        display: none;
      }
    // TODO: Do the colors with variables
    &.isActive {
      filter: invert(1);
    }
    // reset button
    background-color: var(--background-color);
    border: none;
    color: black;
    cursor: pointer;
    display: flex;
    width: 100%;
    padding: var(--padding-m);
    border-radius: var(--border-radius-button);
    align-items: center;
    gap: 0.5em;
    transition: var(--transition);
  }

  .star {
    height: 0.8em;
    width: 0.8em;
  }

  button:hover {
    background-color: var(--hover-color);
    transition: var(--transition);
  }
</style>
