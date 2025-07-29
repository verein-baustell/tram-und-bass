<script lang="ts">
    import "@mux/mux-player";
    import { onMount } from "svelte";
    import TopMenu from "$lib/TopMenu.svelte";
    import VideoControls from "$lib/VideoControls.svelte";
    import BottomMenu from "$lib/BottomMenu.svelte";
    import LandingScreen from "$lib/LandingScreen.svelte";
    import WelcomeScreen from "$lib/WelcomeScreen.svelte";
    import { initFinalState, recoverState } from "../utils/stateManager";
    import { changeToLineAtTime } from "../utils/changeToLineAtCurrentTime";
    import {
        currentLine,
        isImmersive,
        videoIsPlaying,
        videoIsLoading,
        muxVideoObject,
        allLines,
        devToolsState,
        isMobile,
        currentTime,
        timeUntilNextStation,
        previousStation,
        nextStation,
        cookieConsent,
    } from "../store";
    import DevTools from "$lib/DevTools.svelte";
    import registerMuxEventListeners from "../utils/registerMuxEventListeners";
    import SplashScreen from "$lib/SplashScreen.svelte";
    import LoadingScreen from "$lib/LoadingScreen.svelte";
    import { attributes as aboutContent } from "../content/about.md";
    import compareStationNames from "../utils/compareStationNames";
    import { goto } from "$app/navigation";
    import { hmsToSeconds } from "../utils/timeFormatter";
    import consoleInit from "../utils/consoleInit";

    let videoWrapperWidth = "100%";
    let videoWrapperHeight = "100%";
    let videoWidth = 0;
    let videoHeight = 0;
    let extraWidth = 0;
    let isDevMode = false;
    let showSplashScreen = true;
    const releasedLines = $allLines.filter((line) => line.isReleased);
    let randomIndex = Math.floor(Math.random() * (releasedLines.length - 1));
    let tempLine = releasedLines[randomIndex];

    function onPlayerReady(event: any) {
        if (event.target) {
            console.log("Player is ready");
            $muxVideoObject = event.target;
            registerMuxEventListeners();
        }
    }

    // Set `initialized` to true after `cookieConsent` is set
    import { browser } from "$app/environment";
    let initialized = false;
    if (browser) {
        cookieConsent.subscribe(() => {
            initialized = true;
        });
    }

    const readLineFromPath = () => {
        // leave line parameter in url if no cookie is set
        const url = new URL(window.location.href);
        const lineIdFromUrl = url.searchParams.get("line");
        if (lineIdFromUrl) {
            const lineFromUrl = $allLines.find((line) =>
                compareStationNames(line.id, lineIdFromUrl)
            );
            if (lineFromUrl && lineFromUrl.isReleased) {
                // set the line
                tempLine = lineFromUrl;
                if (!$cookieConsent) {
                    tempLine = lineFromUrl;
                    return;
                } else {
                    $currentLine = lineFromUrl;
                }
            } else {
                console.log("line in url not released or not existant");
                url.searchParams.delete("line");
                goto(url.toString(), { replaceState: true });
            }
        } else {
            if (!$cookieConsent) {
                return;
            } else {
                $currentLine = tempLine;
            }
        }
    };

    const today = new Date();
    const releaseDate = new Date("2024-01-01T22:00:00");
    const showLandingPage = today <= releaseDate;

    onMount(() => {
        consoleInit();
        initFinalState();
        readLineFromPath();

        if (showLandingPage) return;
        isDevMode =
            window.location.hostname === "localhost" ||
            localStorage.getItem("devMode") === "true";
        // @ts-ignore
        window.devMode = () => {
            isDevMode = true;
            localStorage.setItem("devMode", "true");
        };
        // @ts-ignore
        window.disableDevMode = () => {
            isDevMode = false;
            localStorage.setItem("devMode", "false");
        };
        // Reactive statement to run the initVideo function when cookieConsent becomes true
        const adjustDimensionsOfVideoWrapper = () => {
            if (window.innerHeight > (window.innerWidth * 9) / 16) {
                videoWrapperWidth = "auto";
                videoWrapperHeight = "100%";
                videoHeight = window.innerHeight;
                videoWidth = (16 / 9) * videoHeight;
            } else {
                videoWrapperWidth = "100%";
                videoWrapperHeight = "auto";
                videoWidth = window.innerWidth;
                videoHeight = (9 / 16) * videoWidth;
            }
            if (window.innerWidth <= 768) {
                isMobile.set(true);
            } else {
                isMobile.set(false);
            }
            extraWidth = videoWidth - window.innerWidth;
        };
        adjustDimensionsOfVideoWrapper();
        window.addEventListener("resize", adjustDimensionsOfVideoWrapper);

        // add a event listener for mouse movement to animate the panning of the video by changing the left css property
        const mousePan = (e: MouseEvent) => {
            if ($videoIsPlaying && $isImmersive) {
                const videoContainer =
                    document.getElementById("video-container");
                if (videoContainer) {
                    if (extraWidth > 0) {
                        const percentage = e.clientX / window.innerWidth - 0.5; // Range from -0.5 to +0.5
                        const translateX = -percentage * extraWidth;
                        videoContainer.style.transition = "";
                        videoContainer.style.setProperty(
                            "--translateX",
                            `${translateX}px`
                        );
                    } else {
                        videoContainer.style.setProperty("--translateX", "0px");
                    }
                }
            }
        };
        if (!$isMobile) {
            document.addEventListener("mousemove", mousePan);
        }
        const keyHandlers = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" && $nextStation && $muxVideoObject) {
                $muxVideoObject.currentTime =
                    $currentTime + $timeUntilNextStation;
            }
            if (e.key === "ArrowLeft" && $previousStation && $muxVideoObject) {
                $muxVideoObject.currentTime = hmsToSeconds(
                    $previousStation.startTime
                );
            }
            if (e.key === "ArrowUp" && $muxVideoObject) {
                $muxVideoObject.currentTime = $currentTime - 2;
            }
            if (e.key === "ArrowDown" && $muxVideoObject) {
                $muxVideoObject.currentTime = $currentTime + 2;
            }
            if (e.key === "I") {
                $isImmersive = !$isImmersive;
            }
            if (e.key === "Z" || e.key === "z") {
                const state = recoverState(0);
                if (state && state.line)
                    changeToLineAtTime(state.line, state.time);
            }
            if (
                /^\d$/.test(e.key) &&
                $currentLine?.timeStamps &&
                $muxVideoObject
            ) {
                $muxVideoObject.currentTime = hmsToSeconds(
                    $currentLine.timeStamps[+e.key].startTime
                );
            }
        };
        document.addEventListener("keydown", keyHandlers);
        return () => {
            window.removeEventListener(
                "resize",
                adjustDimensionsOfVideoWrapper
            );
            document.removeEventListener("mousemove", mousePan);
            document.removeEventListener("keydown", keyHandlers);
        };
    });
    $: {
        // center video if immersive mode is off
        if (!$isImmersive && typeof document !== "undefined") {
            const videoContainer = document.getElementById("video-container");
            if (videoContainer) {
                videoContainer.style.transition = "transform 0.5s ease-in-out";
                videoContainer.style.setProperty("--translateX", "0px");
            }
        }
        if (typeof document !== "undefined") {
            document.addEventListener("gesturestart", function (e) {
                e.preventDefault();
            });
            document.addEventListener(
                "touchmove",
                (e: TouchEvent) => {
                    if ((e.target as HTMLElement)?.closest(".view")) {
                        return; // Allow default behavior
                    }
                    e.preventDefault();
                },
                { passive: false }
            );
        }
    }
    const meta = {
        title: "Tram und Bass",
        description: "Tram und Bass - 30 Artists 30 Tramlinien.",
        image: "/images/uploads/tnb_og.png",
        domain: "tramundbass.ch",
    };
</script>

<svelte:head>
    <title>{meta.title}</title>
    <meta name="description" content={meta.description} />
    <meta
        name="keywords"
        content="Tram und Bass, Tram, Bass, Zürich, VBZ, elektronische Musik"
    />
    <!-- Facebook Meta Tags -->
    <meta property="og:url" content={"https://" + meta.domain} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={meta.title} />
    <meta property="og:description" content={meta.description} />
    <meta property="og:image" content={meta.image} />

    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content={meta.domain} />
    <meta property="twitter:url" content={"https://" + meta.domain} />
    <meta name="twitter:title" content={meta.title} />
    <meta name="twitter:description" content={meta.description} />
    <meta name="twitter:image" content={meta.image} />
</svelte:head>
{#if showLandingPage}
    <LandingScreen />
{:else}
    <div
        id="video-container"
        class={$videoIsLoading ? "" : "isLoading"}
        style={`width: ${videoWrapperWidth}; height: ${videoWrapperHeight};`}
    >
        {#if $currentLine?.videoUrl}
            <mux-player
                src={$currentLine.videoUrl}
                controls={false}
                autoplay={false}
                loop={false}
                muted={true}
                style="width: 100%; height: 100%;"
                metadata-video-title={$currentLine?.name || ""}
                metadata-video-id={$currentLine?.id || ""}
                on:loadedmetadata={onPlayerReady}
            ></mux-player>
        {/if}
    </div>
    {#if showSplashScreen || !$currentLine?.isReleased}
        <SplashScreen onClick={() => (showSplashScreen = false)} />
    {/if}
    <LoadingScreen
        style={`width: ${videoWrapperWidth}; height: ${videoWrapperHeight};`}
    />
    <VideoControls />
    {#if isDevMode}
        <DevTools />
    {/if}
    {#if initialized && !$cookieConsent}
        <WelcomeScreen line={tempLine} />
    {/if}
    {#if !$isImmersive}
        <TopMenu aboutContent={aboutContent?.aboutText ?? ""} />
        <BottomMenu />
    {/if}
{/if}

<style lang="scss">
    :root {
        --background-color: rgb(255, 255, 255);
        --foreground-color: black;
        --background-color-light: #eeeeee;
        --hover-color: #dddddd;
        --border-radius-button: 0.4em;
        --border-radius-view: 0.52em;
        --padding-view: 0.5em 0.8em;
        --font-size: 1em;
        --global-padding: 0.8em;
        --transition: ease-in-out 0.3s;
        --padding-m: 0.24em;
        --padding-ml: 0.05em 0.5em 0.24em 0.48em;
        --padding-l: 0.48em;
        --mobile-breakpoint: 600px;
        --padding-s: 0.12em;
        $mobile-breakpoint: 600px;

        @font-face {
            font-family: Rene;
            font-style: normal;
            font-weight: 400;
            src: url("/fonts/Rene-Regular-Web.woff") format("woff");
        }

        @font-face {
            font-family: Holo;
            font-style: normal;
            font-weight: 500;
            src: url("/fonts/NaNHoloNarrow-Regular.woff2") format("woff2");
        }

        @font-face {
            font-family: HoloMono;
            font-style: normal;
            font-weight: 500;
            src: url("/fonts/NaNHoloMono-Medium.woff2") format("woff2");
        }
    }
    #video-container {
        transition: filter 0.5s ease-in-out;
        // &.isLoading {
        //   filter: blur(24px);
        // }
        position: absolute;
        aspect-ratio: 16 / 9;
        pointer-events: none;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) translateX(var(--translateX, 0));
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        z-index: -200;
    }

    :global(.activeVideo) {
        display: grid !important;
    }
</style>
