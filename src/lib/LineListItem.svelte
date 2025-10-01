<script lang="ts">
    import { onMount } from "svelte";
    import { currentLine } from "../store";
    import LineNumber from "./LineNumber.svelte";
    import checkOverflow from "../utils/checkOverflow";
    export let onClick: (lineClicked: Line) => void;
    export let line: Line;
    const releaseDate = new Date(line.releaseDate);
    const formattedDate = releaseDate
        .toLocaleDateString("en-GB")
        .replace(/\//g, ".");

    let nameContainer: HTMLElement | undefined = undefined;
    let isOverflowing = false;
    let overflowRatio = 1;

    onMount(() => {
        const updateOverflow = () => {
            const overflowData = checkOverflow(nameContainer);
            isOverflowing = overflowData.isOverflowing;
            overflowRatio = overflowData.overflowRatio;
        };

        updateOverflow();

        window.addEventListener("resize", updateOverflow);
    });
</script>

<li>
    <button
        on:click={() => line.isReleased && onClick(line) && checkOverflow()}
        disabled={!line.isReleased}
        on:keydown={(e) => {
            if (e.key === "Enter" && line.isReleased) {
                onClick(line);
            }
        }}
        class:isActive={$currentLine === line}
    >
        <LineNumber number={line.number} />
        <span>{line.name}</span>
        <img class="star" src="/images/divider.svg" alt="-" />
        <div class="nameContainer" bind:this={nameContainer}>
            {#if isOverflowing}
                <div
                    class="marquee"
                    style="--animation-duration: {5 +
                        overflowRatio / 50}s; --translate-x: {-10 -
                        overflowRatio}px;"
                >
                    {line.isReleased ? line.artistName : "coming soon"}
                </div>
            {:else}
                <p>{line.isReleased ? line.artistName : "coming soon"}</p>
            {/if}
        </div>
        <p class="releaseDate">{formattedDate}</p>
    </button>
</li>

<style lang="scss" scoped>
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
        gap: 0.5em;
        transition: var(--transition);
        span {
            white-space: nowrap;
        }
    }

    .star {
        height: 0.8em;
        width: 0.8em;
    }

    button:hover {
        background-color: var(--hover-color);
        transition: var(--transition);
    }
</style>
