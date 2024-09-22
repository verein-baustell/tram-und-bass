<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    export let aboutContent: string;

</script>
<div class="view detailed-view">
    <p>
        <SvelteMarkdown source={aboutContent} /> 
    </p>

    
</div>