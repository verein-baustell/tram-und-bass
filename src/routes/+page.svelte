<script>
    import Globe from "$lib/Globe.svelte";
</script>

<main class="main-container">
    <img
        src="/images/TnB_wordmark_orange.svg"
        alt="Tram & Bass International"
        class="title-logo"
    />

    <div class="globe-section">
        <Globe
            initialLat={50}
            initialLng={20}
            initialAltitude={0.7}
            enableAutoRotate={true}
            autoRotateSpeed={0.1}
        />
    </div>
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
        position: absolute;
        top: 40px;
    }
</style>
