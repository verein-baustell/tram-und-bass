<script lang="ts">
  import { currentLine } from "../store";
  import LineNumber from "./LineNumber.svelte";
  import ChangeStationList from "./ChangeStationList.svelte";
  import StationList from "./StationList.svelte";
  import Artist from "./Artist.svelte";
  import Button from "./Button.svelte";
  import { clickoutside } from "@svelte-put/clickoutside";
  type ComponentType =
    | typeof ChangeStationList
    | typeof StationList
    | typeof Artist;
  let menuEntries: { name: string; component: ComponentType }[];
  let currentComponent: ComponentType;
  $: if ($currentLine) {
    menuEntries = [
      { name: $currentLine.name, component: ChangeStationList },
      { name: "StationList", component: StationList },
      { name: $currentLine.artistName, component: Artist },
    ];
    currentComponent = menuEntries?.[0]?.component;
  }
  let isOpen = true;
  let isInverted = $currentLine.isInverted;
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
  <nav style:background-color={$currentLine.color}>
    <LineNumber
      number={$currentLine.number}
      isInverted={$currentLine.isInverted}
    />
    {#each menuEntries as { name, component } (name)}
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
        style={currentComponent === component && isOpen
          ? `color: ${$currentLine.color}`
          : ``}
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
    border-radius: 0.4em;
    align-items: center;
  }
</style>
