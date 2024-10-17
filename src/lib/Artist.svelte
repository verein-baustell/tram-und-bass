<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    import { currentLine } from "../store";
</script>

<div class="view detailed-view">
    <div class="artist-about-cont">
        <SvelteMarkdown source={$currentLine.artistAboutText} /> 
    </div>
</div>

<style lang="scss" scoped>
    .artist-about-cont {
        display: flex;
        flex-flow: column wrap;
        gap: 0.25rem;
        padding: 0.25rem;
    }
</style>