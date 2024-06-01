<script lang="ts">
  import Map from "./Map.svelte";
  import About from "./About.svelte";
  import LineList from "./LineList.svelte";
  export let lines: Line[];
  export let aboutContent: string;
  const meuEntries = [
    { name: "List", component: LineList },
    { name: "Map", component: Map },
    { name: "About", component: About },
  ];
</script>

<nav>TopMenu</nav>
