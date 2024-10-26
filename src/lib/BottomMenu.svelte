<script lang="ts">
  import { 
    currentLine,
    isMenuClosed
  } from "../store";
  import LineNumber from "./LineNumber.svelte";
  import ChangeLineList from "./ChangeLineList.svelte";
  import StationList from "./StationList.svelte";
  import Artist from "./Artist.svelte";
  import Button from "./Button.svelte";
  import { clickoutside } from "@svelte-put/clickoutside";
  type ComponentType =
    | typeof ChangeLineList
    | typeof StationList
    | typeof Artist;
  let menuEntries: { name: string; component: ComponentType }[];
  let currentComponent: ComponentType;
  $: if ($currentLine) {
    menuEntries = [
      { name: $currentLine.name, component: ChangeLineList },
      { name: "Stationen", component: StationList },
      { name: $currentLine.artistName, component: Artist }
    ];
    currentComponent = menuEntries?.[0]?.component;
  }
  let isOpen = false;
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
    <div class="btm-menu-section">
      <div class="numb">
        <LineNumber number={$currentLine.number} isInverted={$currentLine.isInverted} />
      </div>
    {#each menuEntries as { name, component }, index (name)}
      {#if index === 0}
        <Button
        isActive={currentComponent === component && isOpen}
        class="isInverted-{$currentLine.isInverted} {$currentLine.number === 7 ? "isSeven" : ""} btn-btm-menu btn-btm-menu--first"
        on:click={() => {
          $isMenuClosed = false;
          if (isOpen && currentComponent === component) {
            isOpen = false;
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
      {/if}
      {/each}
    </div>
    {#if !$isMenuClosed}
    <div class="btm-menu-section">
      {#each menuEntries as { name, component }, index (name)}
      {#if index != 0}
      <Button
        isActive={currentComponent === component && isOpen}
        class="isInverted-{$currentLine.isInverted} {$currentLine.number === 7 ? "isSeven" : ""} btn-btm-menu"
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
      {/if}
      {/each}
      <div class="close-btn">
        <Button
          class="btn-btm-menu--close"
          style="background-color: {$currentLine.color}"
          on:click={() => {
            $isMenuClosed = true;
            isOpen = true;
          }}
        >
          <img 
            class="star isInverted-{$currentLine.isInverted}" 
            src="/images/divider.svg" 
            alt="-"
           />
      </Button>
    </div>
    </div>
    {/if}
  </nav>
</div>

<style lang="scss" scoped>
  #bottom-menu {
    display: flex;
    flex-flow: column wrap;
    margin: var(--global-padding);
    position: fixed;
    bottom: 0;
    right: 0;
  }

  .numb {
    margin-left: var(--padding-l);
    margin-right: var(--padding-l);
    filter: invert(1);
  }
  nav {
    display: flex;
    flex-flow: row nowrap;
    width: fit-content;
    align-self: flex-end;
    border-radius: var(--border-radius-view);
    align-items: center;
    background-color: var(--background-color-light);
  }

  .btm-menu-section {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
  }
  .close-btn{
    display: none;
  }

  @media only screen and (max-width: 768px) {
    #bottom-menu {
      left: 0;
      right: inherit;
    }
    nav {
      max-width: calc(100vw - var(--global-padding) - var(--global-padding));
      flex-flow: wrap;
    }
    .close-btn {
      display: flex;
    }
    .isInverted-false {
        filter: invert(1);
      }
    .isInverted-true {
        filter: invert(0);
      }
  }
</style>
