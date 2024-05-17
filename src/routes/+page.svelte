<script lang="ts">
  import { attributes as content } from "../content/lines.md";
  import SvelteMarkdown from "svelte-markdown";
  const lines = content.lines;
</script>

<h1>Welcome to TnB</h1>
{#each lines as line}
  <p>artist: {line.artistName}</p>
  <p>name: {line.name}</p>
  <SvelteMarkdown source={line.artistAboutText} />
  {#each line.timeStamps as timeStamp}
    <p>startTime: {timeStamp.startTime}</p>
    <p>endTime: {timeStamp.endTime}</p>
    <p>location: {timeStamp.name}</p>
  {/each}
{/each}
