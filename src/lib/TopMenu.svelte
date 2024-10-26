<script lang="ts">
  import Map from "./Map.svelte";
  import About from "./About.svelte";
  import LineList from "./LineList.svelte";
  import Button from "./Button.svelte";
  import { clickoutside } from "@svelte-put/clickoutside";
  import { allLines, currentLine } from "../store";
  export let aboutContent: string;
  const meuEntries = [
    { name: "Linien", component: LineList },
    { name: "Netz", component: Map },
    { name: "Info", component: About },
  ];
  let currentComponent = meuEntries[0].component;
  let isOpen = false;
</script>

<div
  id="top-menu"
  use:clickoutside on:clickoutside={() => {
    if (isOpen && currentComponent === Map) {
      return
    }
    isOpen = false;
  }}
>
  <nav>
    {#each meuEntries as { name, component } (name)}
      <Button
        isActive={currentComponent === component && isOpen}
        on:click={() => {
          if (isOpen && currentComponent === component) {
            isOpen = false;
            return;
          }
          currentComponent = component;
          isOpen = true;
        }}
      >
        {name}
      </Button>
    {/each}
  </nav>
  {#if isOpen}
    <svelte:component 
        this={currentComponent} 
        onClick={(clickedLine) => {
            $currentLine = clickedLine;
            isOpen = false;
        }} 
        lines={$allLines} 
        {aboutContent} 
    />
  {/if}
</div>

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
