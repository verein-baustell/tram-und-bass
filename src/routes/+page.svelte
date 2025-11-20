<script>
    import Globe from "$lib/Globe.svelte";
    import { cookieConsent } from "../store";
    import ConsentBanner from "$lib/ConsentBanner.svelte";
    import { attributes as citiesContent } from "../content/cities.md";
    import { goto } from "$app/navigation";
    let noConsent = false;

    $: cookieConsent.subscribe((value) => {
        if (!value) {
            noConsent = true;
        } else {
            noConsent = false;
        }
    });

    // Extract cities from the content
    const cities = citiesContent.cities || [];

    function goToRandomCity() {
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        goto(`/${randomCity.slug}`);
    }
</script>

<main class="main-container">
    <button class="title-logo-button" on:click={goToRandomCity}
        ><img
            src="/images/TnB_wordmark_orange.svg"
            alt="Tram & Bass International"
            class="title-logo"
        /></button
    >

    {#if noConsent}
        <ConsentBanner />
    {:else}
        <div class="globe-section">
            <Globe
                initialLat={50}
                initialLng={20}
                initialAltitude={1}
                enableAutoRotate={true}
                autoRotateSpeed={0.1}
            />
        </div>
    {/if}
</main>

<style>
    .main-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title-logo {
        height: auto;
        width: 90vw;
        max-width: 800px;
        z-index: 1;
        position: relative;
        /* top: 40px; */
    }
    .title-logo-button {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: center;
        margin-top: 40px;
        cursor: pointer;
        background: transparent;
        border: none;
    }
</style>
