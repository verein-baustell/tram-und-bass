<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    import { currentLine, isWider } from "../store";
</script>

<div class="view detailed-view {!$isWider ? 'detailed-view--right' : ''}">
    <div class="artist-about-cont">
        <SvelteMarkdown source={$currentLine?.artistAboutText ?? ""} />
    </div>
</div>

<style lang="scss" scoped>
    .artist-about-cont {
        display: flex;
        flex-flow: column wrap;
        gap: 0.25rem;
        padding: 0.25rem;
        padding-top: 0;
    }
</style>
