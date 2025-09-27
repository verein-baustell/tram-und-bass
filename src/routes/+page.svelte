<script>
    import Globe from "$lib/Globe.svelte";
</script>

<main class="main-container">
    <h1 class="title">Tram & Bass International</h1>

    <div class="globe-section">
        <Globe
            initialLat={50}
            initialLng={20}
            initialAltitude={2}
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

    .title {
        font-size: 3rem;
        font-weight: bold;
        color: white;
        text-align: center;
        letter-spacing: 2px;
        z-index: 1;
        position: absolute;
    }
</style>
