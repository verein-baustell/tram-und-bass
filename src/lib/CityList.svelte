<script lang="ts">
    import LineListItem from "./LineListItem.svelte";
    export let lines: Line[];
    export let viewable = true;
    export let id: string | undefined = undefined;
    export let onClick: (lineClicked: Line) => void;
    export let isClosable = false;
    export let onClose: (() => void) | undefined = undefined;
    export let title: string | undefined | null = undefined;
    import "../style/style.css";
    import { history, isBtmOpen } from "../store";
    import HistoryList from "./HistoryList.svelte";
    export let hasRecoveryButton: boolean = true;
</script>

<div {id} class={"line-list " + (viewable ? "view detailed-view" : "")}>
    {#if title}
        <h4>
            {title}{#if isClosable}
                <button class="close-button" on:click={onClose}>
                    <img class="close" src="/images/close.svg" alt="-" />
                </button>
            {/if}
        </h4>
    {/if}

    {#if $history.length > 0 && !$isBtmOpen && hasRecoveryButton}
        <!-- <HistoryList></HistoryList> -->
    {/if}

    <ul>
        {#each ["Zurich", "Chemnitz"] as city}
            <li>
                <a href={`/${city.toLowerCase()}`}>{city}</a>
            </li>
        {/each}
    </ul>
</div>

<style lang="scss" scoped>
    .line-list {
        overflow-y: scroll;
        overflow-x: hidden;
    }
    h4 {
        font-size: 1.5em;
        margin: 0;
        margin-bottom: 4px;
        font-weight: bold;
        text-align: center;
        top: 0;
        z-index: 1;
        background-color: var(--background-color);
        padding: 0 1.2em;
        position: relative;
    }
    .close-button {
        position: absolute;
        top: 0;
        right: 0;
        background-color: transparent;
        border: none;
        color: inherit;
        font-size: 1em;
        cursor: pointer;
        display: grid;
        place-items: center;
        height: 1.5em;
        padding: 0;
        padding-right: 0.3em;
    }

    .clock {
        border: thin solid white;
        border-radius: 3px;
        padding: 0.03em 0.35em 0.1em 0.35em;
    }

    .numb {
        margin-left: var(--padding-l);
        margin-right: var(--padding-l);
    }

    .close {
        height: 1em;
        width: 1em;
    }
    // reset ul li
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        overflow: hidden;
    }
</style>
