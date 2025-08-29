<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import DevTools from "$lib/DevTools.svelte";
  import WelcomeScreen from "$lib/WelcomeScreen.svelte";
  import { cookieConsent, allLines } from "../store";
  import { page } from "$app/stores";

  let isDevMode = false;
  let initialized = false;

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

<slot />

{#if initialized && !$cookieConsent && isCityRoute}
  <WelcomeScreen line={tempLine} />
{/if}

{#if isDevMode}
  <DevTools />
{/if}
