<script lang="ts">
  import Map from "./Map.svelte";
  import About from "./About.svelte";
  import LineList from "./LineList.svelte";
  import Button from "./Button.svelte";
  export let lines: Line[];
  export let aboutContent: string;
  const meuEntries = [
    { name: "List", component: LineList },
    { name: "Map", component: Map },
    { name: "About", component: About },
  ];
  let currentComponent = meuEntries[0].component;
  let isOpen = false;
</script>

<div id="top-menu">
  <nav>
    {#each meuEntries as { name, component } (name)}
      <Button
        isActive={currentComponent === component}
        on:click={() => {
          currentComponent = component;
        }}
      >
        {name}
      </Button>
    {/each}
  </nav>
  <svelte:component this={currentComponent} {lines} {aboutContent} />
</div>

<style lang="scss" scoped>
  #top-menu {
    position: fixed;
    top: 0;
    left: 0;
    nav {
      display: flex;
    }
  }
</style>
