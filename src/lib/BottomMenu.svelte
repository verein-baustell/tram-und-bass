<script lang="ts">
  import { currentLine } from "../store";
  import LineNumber from "./LineNumber.svelte";
  import ChangeStationList from "./ChangeStationList.svelte";
  import StationList from "./StationList.svelte";
  import Artist from "./Artist.svelte";
  import Button from "./Button.svelte";
  import { clickoutside } from "@svelte-put/clickoutside";
  export let lines: Line[];
  let meuEntries;
  $: meuEntries = [
    { name: $currentLine.name, component: ChangeStationList },
    { name: "StationList", component: StationList },
    { name: $currentLine.artistName, component: Artist },
  ];
  let currentComponent = meuEntries?.[0]?.component;
  let isOpen = false;
  let isInverted = $currentLine.isInverted
  let color = $currentLine.color
</script>

<div
  id="bottom-menu"
  use:clickoutside
  on:clickoutside={() => {
    isOpen = false;
  }}
>
  {#if isOpen}
    <svelte:component this={currentComponent} />
  {/if}
  <nav style:background-color={color}>
    <LineNumber number={$currentLine.number} isInverted={$currentLine.isInverted}/>
    {#each meuEntries as { name, component } (name)}
      <Button
        isActive={currentComponent === component && isOpen}
        class="isInverted-{isInverted}"
        on:click={() => {
          if (isOpen && currentComponent === component) {
            isOpen = false;
            return;
          }
          currentComponent = component;
          isOpen = true;
        }}
        style={currentComponent === component && isOpen ? `color: ${color}` : ``}
      >
        {name}
      </Button>
    {/each}
  </nav>
</div>

<style lang="scss" scoped>
  #bottom-menu {
    margin: 1em;
    position: fixed;
    bottom: 0;
    right: 0;
  }
  nav {
    display: flex;
    gap: 2px;
    padding: .2em;
    border-radius: .4em;
    align-items: center
  }
</style>
