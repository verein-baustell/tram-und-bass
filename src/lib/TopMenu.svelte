<script lang="ts">
    import Map from "./Map.svelte";
    import About from "./About.svelte";
    import LineList from "./LineList.svelte";
    import CityList from "./CityList.svelte";
    import Button from "./Button.svelte";
    import { clickoutside } from "@svelte-put/clickoutside";
    import {
        allLines,
        currentLine,
        currentTime,
        isTopOpen,
        isPlayButtonOn,
        currentCitySlug,
        currentCityName,
        currentCityShortName,
        isMobile,
    } from "../store";
    import { addState } from "../utils/stateManager";
    export let aboutContent: string;

    // Make menuEntries reactive to city name changes and mobile state
    $: menuEntries = [
        {
            name: $isMobile
                ? $currentCityShortName || "Städte"
                : $currentCityName || "Städte",
            component: CityList,
        },
        { name: "Linien", component: LineList },
        { name: "Netz", component: Map },
        { name: "Info", component: About },
    ];

    let currentComponent = CityList; // Default to CityList component
</script>

{#if $currentLine}
    <div class="topMenu--cont">
        <div
            id="top-menu"
            use:clickoutside
            on:clickoutside={() => {
                if ($isTopOpen && currentComponent === Map) {
                    return;
                }
                isTopOpen.set(false);
            }}
        >
            <nav>
                {#each menuEntries as { name, component } (name)}
                    <Button
                        isActive={currentComponent === component && $isTopOpen}
                        on:click={() => {
                            if ($isTopOpen && currentComponent === component) {
                                isTopOpen.set(false);
                                return;
                            }
                            currentComponent = component;
                            isTopOpen.set(true);
                        }}
                    >
                        {name}
                    </Button>
                {/each}
                {#if $isTopOpen}
                    <svelte:component
                        this={currentComponent}
                        onClick={(clickedLine) => {
                            addState();
                            currentLine.set(clickedLine);
                            isTopOpen.set(false);
                            isPlayButtonOn.set(false);
                        }}
                        lines={$allLines}
                        {aboutContent}
                    />
                {/if}
            </nav>
        </div>
    </div>
{/if}

<style lang="scss" scoped>
    .topMenu--cont {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    #top-menu {
        display: flex;
        flex-flow: column wrap;
        padding-inline: var(--global-padding);
        margin-block: var(--global-padding);
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: all;
        width: calc(100% - 1.6em);
    }
    nav {
        display: flex;
        width: fit-content;
        flex-flow: row nowrap;
        border-radius: var(--border-radius-view);
        background-color: var(--background-color-light);
    }
</style>
