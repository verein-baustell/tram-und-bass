<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    import { currentLine } from "../store";
</script>

<div class="view detailed-view">
    <p>
        <SvelteMarkdown source={$currentLine.artistAboutText} /> 
    </p>
</div>