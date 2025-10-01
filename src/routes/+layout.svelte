<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { get } from "svelte/store";
    import DevTools from "$lib/DevTools.svelte";
    import { cookieConsent, allLines } from "../store";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    let isDevMode = false;
    let initialized = false;
    let hasConsent = false;

    // Choose a random released line (if available) to style the consent UI
    let tempLine: any = undefined;
    $: {
        const released = $allLines?.filter((line) => line.isReleased) ?? [];
        if (released.length > 0) {
            const idx = Math.floor(Math.random() * released.length);
            tempLine = released[idx];
        } else {
            tempLine = undefined;
        }
    }

    // Only show consent UI on city routes
    let isCityRoute = false;
    if (browser) {
        page.subscribe(($page) => {
            isCityRoute = Boolean($page.params.city);
        });
    }

    if (browser) {
        cookieConsent.subscribe(() => {
            initialized = true;
            hasConsent = get(cookieConsent);
        });

        // Check consent and redirect to home if no consent on city routes
        page.subscribe(($page) => {
            const isCityRoute = Boolean($page.params.city);

            if (isCityRoute && !hasConsent) {
                goto("/", { replaceState: true });
            }
        });
    }

    onMount(() => {
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
    });
</script>

{#if initialized && (!isCityRoute || hasConsent)}
    <slot />
{/if}

{#if isDevMode}
    <DevTools />
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
</style>
