<script lang="ts">
    import Button from "./Button.svelte";
    import { giveConsent } from "../utils/cookieManager";

    // Handle the button click, wait for $muxVideoObject if necessary
    async function handlePlayClick() {
        console.log("handlePlayClick");
        giveConsent(); // Give cookie consent
    }
</script>

<div class="consent-banner">
    <div class="consent-banner-content">
        <p class="titles">Cookies</p>
        <p class="consent-banner-text">
            Wir verwenden Cookies von Drittanbietern, darunter Mux. Diese
            Cookies sind notwendig für die Funktionalität der Seite. Durch das
            Klicken auf den Button stimmst du den Cookies zu.
        </p>
        <button on:click={handlePlayClick}>Zustimmen und gut festhalten!</button
        >
    </div>
</div>

<style lang="scss" scoped>
    button {
        background-color: rgb(183, 183, 183);
        padding: 0.5em 0.8em;
        color: black;
        border: none;
        border-radius: var(--border-radius-button);
        cursor: pointer;
        margin: 0.12em 0.12em 0.12em 0em;
        transition: var(--transition);
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        min-height: 40px;

        &:hover {
            background-color: rgb(255, 178, 35);
            transition: var(--transition);
        }

        &:active {
            background-color: var(--foreground-color);
            color: var(--background-color);
        }
    }

    .consent-banner {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        padding: 2em;
        width: 100vw;
        max-width: 500px;
        z-index: 10000;
    }

    .consent-banner-content {
        width: 100%;
        padding: 1em;
        border-radius: 0.52em;
        background-color: white;
        text-align: center;
    }

    .line--cont {
        display: flex;
        width: fit-content;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        border-radius: var(--border-radius-view);
        padding: 0.12em;
        margin: 1em 0em 1em 0em;
        animation: pulse 4s ease-in-out infinite;
    }

    .numb {
        margin-left: var(--padding-l);
        margin-right: var(--padding-l);
    }

    .titles {
        font-family: Rene;
        margin-bottom: 0.6em;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }

    .consent-banner-text {
        margin-bottom: 1em;
    }
</style>
