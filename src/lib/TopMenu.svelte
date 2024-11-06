<script lang="ts">
  import Map from "./Map.svelte";
  import About from "./About.svelte";
  import LineList from "./LineList.svelte";
  import Button from "./Button.svelte";
  import { clickoutside } from "@svelte-put/clickoutside";
  import {
    allLines,
    currentLine,
    isTopOpen,
    isBtmOpen,
    cookieConsent,
  } from "../store";
  export let aboutContent: string;
  const menuEntries = [
    { name: "Linien", component: LineList },
    { name: "Netz", component: Map },
    { name: "Info", component: About },
  ];
  let currentComponent = menuEntries[0].component;
</script>

{#if $currentLine}
  <div
    id="top-menu"
    use:clickoutside
    on:clickoutside={() => {
      if ($isTopOpen && currentComponent === Map) {
        return;
      }
      isTopOpen.set(false);
    }}
  >
    <nav>
      {#each menuEntries as { name, component } (name)}
        <Button
          isActive={currentComponent === component && $isTopOpen}
          on:click={() => {
            if ($isTopOpen && currentComponent === component) {
              isTopOpen.set(false);
              return;
            }
            currentComponent = component;
            isTopOpen.set(true);
          }}
        >
          {name}
        </Button>
      {/each}
    </nav>
    {#if $isTopOpen}
      <svelte:component
        this={currentComponent}
        onClick={(clickedLine) => {
          currentLine.set(clickedLine);
          isTopOpen.set(false);
        }}
        lines={$allLines}
        {aboutContent}
      />
    {/if}
  </div>
{/if}

<style lang="scss" scoped>
  #top-menu {
    position: fixed;
    top: 0;
    left: 0;
    margin: var(--global-padding);
    nav {
      width: fit-content;
      background: var(--background-color-light);
      border-radius: var(--border-radius-view);
    }
  }
</style>
