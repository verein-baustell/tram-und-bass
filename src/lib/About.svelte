<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    export let aboutContent: string;

</script>
<p>
    <SvelteMarkdown source={aboutContent} /> 
</p>