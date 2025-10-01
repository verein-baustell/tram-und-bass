<script lang="ts">
    export let viewable = true;
    export let id: string | undefined = undefined;
    export let onClick: (lineClicked: Line) => void;
    export let isClosable = false;
    export let onClose: (() => void) | undefined = undefined;
    export let title: string | undefined | null = undefined;
    import "../style/style.css";
    import {
        history,
        isBtmOpen,
        currentCitySlug,
        currentCityName,
        isTopOpen,
    } from "../store";
    import { attributes as citiesContent } from "../content/cities.md";

    // Extract cities from the content
    const cities = citiesContent.cities || [];
</script>

<div {id} class={"city-list " + (viewable ? "view detailed-view" : "")}>
    <ul>
        {#each cities as city}
            <li>
                <button
                    class:isActive={$currentCitySlug === city.slug}
                    on:click={() => {
                        isTopOpen.set(false);
                    }}
                >
                    <a href={`/${city.slug}`}>{city.name}</a>
                </button>
            </li>
        {/each}
    </ul>
</div>

<style lang="scss" scoped>
    .city-list {
        width: auto !important;
    }
    // reset ul li
    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        overflow: hidden;
    }

    a {
        text-decoration: none;
        color: inherit;
        height: 28px;
        padding: 0px 20px;
    }

    button {
        position: relative;
        &:disabled {
            opacity: 0.5;
            cursor: help;
            img {
                filter: blur(3px);
                padding-left: 2px;
            }
            p {
                filter: blur(3px);
                padding: 2px 4px;
            }
            &:hover {
                .releaseDate {
                    display: flex;
                    position: absolute;
                    right: 4px;
                    filter: blur(0px);
                    padding: 1px 4px 1px 4px;
                    border: thin solid black;
                    border-radius: 4px;
                }
            }
        }
        .releaseDate {
            display: none;
        }
        // TODO: Do the colors with variables
        &.isActive {
            filter: invert(1);
        }
        // reset button
        background-color: var(--background-color);
        border: none;
        color: black;
        cursor: pointer;
        display: flex;
        width: 100%;
        padding: var(--padding-m);
        border-radius: var(--border-radius-button);
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        transition: var(--transition);
        span {
            white-space: nowrap;
        }
    }
    button:hover {
        background-color: var(--hover-color);
        transition: var(--transition);
    }
</style>
