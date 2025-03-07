<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import {
        currentLine,
        isMenuMinimized,
        currentStation,
        isBtmOpen,
        isTopOpen,
        isWider,
    } from "../store";
    import LineNumber from "./LineNumber.svelte";
    import ChangeLineList from "./ChangeLineList.svelte";
    import StationList from "./StationList.svelte";
    import Artist from "./Artist.svelte";
    import Button from "./Button.svelte";
    import { clickoutside } from "@svelte-put/clickoutside";
    import checkOverflow from "../utils/checkOverflow";
    type ComponentType =
        | typeof ChangeLineList
        | typeof StationList
        | typeof Artist;
    let menuEntries: { name: string; component: ComponentType }[];
    let currentComponent: ComponentType;
    $: if ($currentLine) {
        menuEntries = [
            { name: $currentLine.name, component: ChangeLineList },
            { name: "Stationen", component: StationList },
            { name: $currentLine.artistName, component: Artist },
        ];
        currentComponent = menuEntries?.[0]?.component;
    }
    $: if ($currentStation && !$isBtmOpen && !$isTopOpen && !$isMenuMinimized) {
        isBtmOpen.set(true);
        currentComponent = menuEntries[0]?.component;
    }

    $: if ($currentStation == undefined) {
        isBtmOpen.set(false);
    }

    let nameContainerBtm: HTMLElement | undefined = undefined;
    let isOverflowing = false;
    let overflowRatio = 1; // default ratio if no overflow

    function checkMenuWidth() {
        let menu = document.getElementById("bottom-menu");
        if (menu && menu.clientWidth > 320) {
            isWider.set(true);
        } else {
            isWider.set(false);
        }
    }

    afterUpdate(() => {
        const overflowData = checkOverflow(nameContainerBtm);
        isOverflowing = overflowData.isOverflowing;
        overflowRatio = overflowData.overflowRatio;
        checkMenuWidth();
    });

    onMount(() => {
        const updateOverflow = () => {
            const overflowData = checkOverflow(nameContainerBtm);
            isOverflowing = overflowData.isOverflowing;
            overflowRatio = overflowData.overflowRatio;
        };

        updateOverflow();

        window.addEventListener("resize", updateOverflow);
    });
</script>

{#if $currentLine}
    <div class="btmMenu--cont">
        <div
            id="bottom-menu"
            class={$isMenuMinimized ? "putRight" : ""}
            use:clickoutside
            on:clickoutside={() => {
                isBtmOpen.set(false);
            }}
        >
            {#if $isBtmOpen}
                <svelte:component this={currentComponent} />
            {/if}
            <nav style:background-color={$currentLine?.color}>
                <div
                    class="nav-element nav-element--top {$isMenuMinimized
                        ? 'nav-element--nomargin'
                        : ''} "
                >
                    <div class="numb">
                        <LineNumber
                            number={$currentLine?.number}
                            isInverted={$currentLine?.isInverted}
                        />
                    </div>
                    {#each menuEntries as { name, component }, index (name)}
                        {#if index === 0}
                            <Button
                                isActive={currentComponent === component &&
                                    $isBtmOpen}
                                class="isInverted-{$currentLine?.isInverted} {$currentLine?.number ===
                                7
                                    ? 'isSeven'
                                    : ''} {$isMenuMinimized
                                    ? 'btnTiny--margin'
                                    : 'btnLine'}"
                                on:click={() => {
                                    if (
                                        $isBtmOpen &&
                                        currentComponent === component
                                    ) {
                                        isBtmOpen.set(false);
                                        return;
                                    }
                                    if ($isMenuMinimized) {
                                        $isMenuMinimized = false;
                                    }
                                    currentComponent = component;
                                    isBtmOpen.set(true);
                                }}
                                style={currentComponent === component &&
                                $isBtmOpen
                                    ? `color: ${$currentLine?.color}`
                                    : ``}
                            >
                                {name}
                            </Button>
                        {/if}
                    {/each}
                </div>
                <div class="nav-element nav-element--btm">
                    {#if !$isMenuMinimized}
                        {#each menuEntries as { name, component }, index (name)}
                            {#if index != 0}
                                <Button
                                    isActive={currentComponent === component &&
                                        $isBtmOpen}
                                    class="isInverted-{$currentLine?.isInverted} {$currentLine?.number ===
                                    7
                                        ? 'isSeven'
                                        : ''} {name === 'Stationen'
                                        ? 'btnStation'
                                        : 'btnArtist'}"
                                    on:click={() => {
                                        if (
                                            $isBtmOpen &&
                                            currentComponent === component
                                        ) {
                                            isBtmOpen.set(false);
                                            return;
                                        }
                                        currentComponent = component;
                                        isBtmOpen.set(true);
                                    }}
                                    style={currentComponent === component &&
                                    $isBtmOpen
                                        ? `color: ${$currentLine?.color}`
                                        : ``}
                                >
                                    <div
                                        class="nameContainerBtm"
                                        bind:this={nameContainerBtm}
                                    >
                                        {#if isOverflowing && name != "Stationen"}
                                            <div
                                                class="marquee"
                                                style="--animation-duration: {5 +
                                                    overflowRatio /
                                                        50}s; --translate-x: {-10 -
                                                    overflowRatio}px;"
                                            >
                                                {name}
                                            </div>
                                        {:else}
                                            {name}
                                        {/if}
                                    </div>
                                </Button>
                            {/if}
                        {/each}
                        <Button
                            class="btnClose"
                            style="background-color: {$currentLine?.color}"
                            on:click={() => {
                                $isMenuMinimized = true;
                                isBtmOpen.set(true);
                            }}
                        >
                            <img
                                class="close isInverted-{$currentLine?.isInverted}"
                                src="/images/close.svg"
                                alt="-"
                            />
                        </Button>
                    {/if}
                </div>
            </nav>
        </div>
    </div>
{/if}

<style lang="scss" scoped>
    .btmMenu--cont {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    #bottom-menu {
        display: flex;
        flex-flow: column wrap;
        margin: var(--global-padding);
        position: absolute;
        bottom: 0;
        right: 0;
        pointer-events: all;
    }
    .nameContainerBtm {
        overflow: hidden;
    }
    nav {
        display: flex;
        flex-flow: row nowrap;
        border-radius: var(--border-radius-view);
        background-color: var(--background-color-light);
        padding: 0.12em;
    }

    .numb {
        margin-left: var(--padding-l);
        margin-right: var(--padding-l);
        filter: invert(1);
    }

    .nav-element {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
    }
    .nav-element--nomargin .btnTiny {
        margin-right: 1.5px;
    }

    @media only screen and (max-width: 768px) {
        #bottom-menu {
            left: 0;
        }
        .putRight {
            right: inherit !important;
        }
        nav {
            flex-flow: column wrap;
            max-width: calc(100% - 0.08em);
        }
        .nav-element {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            &--top {
                margin-bottom: 0.12em;
            }
            &--nomargin {
                margin-bottom: 0em !important;
            }
        }
        .close {
            min-width: 24px;
            min-height: 24px;
        }
        .isInverted-false {
            filter: invert(1);
        }
        .isInverted-true {
            filter: invert(0);
        }
    }
</style>
