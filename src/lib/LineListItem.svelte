<script lang="ts">
  import { currentLine } from "../store";
  import LineNumber from "./LineNumber.svelte";
  export let onClick: (lineClicked: Line) => void;
  export let line: Line;
</script>

<li>
  <button
    on:click={() => onClick(line)}
    on:keydown={(e) => {
      if (e.key === "Enter") {
        onClick(line);
      }
    }}
    class:isActive={$currentLine === line}
  >
    <LineNumber number={line.number} />
    <span>{line.name}</span>
    <img class="star" src="/images/divider.svg" alt="-" />
    <span>{line.artistName}</span>
  </button>
</li>

<style lang="scss" scoped>
  button {
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
