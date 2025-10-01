<script lang="ts">
    import { onMount } from "svelte";
    import Button from "./Button.svelte";
    import ConsentBanner from "./ConsentBanner.svelte";
    export let line: Line | undefined;

    // Function to set initial opacity for ".view" elements
    const setInitialOpacity = () => {
        const views = document.querySelectorAll<HTMLDivElement>(".view");
        views.forEach((view, index) => {
            if (index !== 0) {
                view.style.opacity = "0.1";
            }
        });
    };

    // Function to handle scroll event
    const handleScroll = () => {
        const views = document.querySelectorAll<HTMLDivElement>(".view");
        views.forEach((view) => {
            view.style.opacity = "1";
            view.style.transition = "1s";
        });
        // Remove the scroll event listener after triggering
        const welcomeScreen = document.getElementById("welcome-screen");
        welcomeScreen?.removeEventListener("scroll", handleScroll);
    };

    // Set up initial opacity and scroll listener on mount
    onMount(() => {
        setInitialOpacity();

        // Add scroll event listener to the #welcome-screen div
        const welcomeScreen = document.getElementById("welcome-screen");
        welcomeScreen?.addEventListener("scroll", handleScroll);
    });
</script>

<div id="welcome-screen">
    <div class="landing--container">
        <img
            class="logo"
            src="/images/TnB_wordmark_orange.svg"
            alt="Tram und Bass"
        />

        <div class="view">
            <ConsentBanner {line} />
        </div>

        <div class="view">
            <p class="titles">Links</p>
            <Button
                isActive={true}
                onclick="location.href='https://www.instagram.com/tramundbass/'"
            >
                Instagram
            </Button>
        </div>

        <div class="view">
            <p class="titles">Info</p>
            <p>
                Tram und Bass lädt dich ein, verträumt aus dem Tram in die Stadt
                hinauszuschauen und dabei 30 einzigartige Musikfahrten zu hören.
                Auf der Musikplattform wird die Vielfalt elektronischer Musik
                aus Zürich audiovisuell präsentiert und für alle zugänglich
                gemacht. Musik, genauso wie Tramfahren, ist ein grosser
                Bestandteil des Zürcher Soziallebens. Sie verbindet und bringt
                Menschen zusammen. Während elektronische Musik immer mehr Platz
                im Internet findet, verliert sie ihren Platz im öffentlichen
                Raum. Die vielen musikalischen Nischen bilden soziale
                Subkulturen, welche wiederum als Nährboden für die Diversität
                der Zürcher Kultur dienen. In den Tramfahrten zeigen wir nicht
                nur Techno, sondern die ganze Bandbreite elektronischer Musik
                von lokaler und internationaler Ausstrahlung. Die Vielfalt der
                musikalischen Subkultur prägt nicht nur die Nacht, sondern auch
                den Tag. Also steig ein, wir wünschen viel Spass beim Entdecken.
            </p>
        </div>

        <div class="view">
            <p class="titles">Kontakt</p>
            <p class="text">
                <b>Verein Tram und Bass </b>
                <br />
                Hardgutstrasse 7
                <br />
                8048 Zürich
                <br />
                <a href="mailto:info@tramundbass.ch">info@tramundbass.ch</a>
            </p>
        </div>
    </div>
</div>

<style lang="scss" scoped>
    #welcome-screen {
        position: absolute;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        overflow: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    #welcome-screen::-webkit-scrollbar {
        display: none;
    }

    .landing--container {
        display: flex;
        flex-flow: column nowrap;
        text-align: center;
        align-items: center;
        width: 40%;
        height: fit-content;
        margin: var(--global-padding);
        gap: 0.4em;
        margin-bottom: 4em;
    }

    .logo {
        padding-top: 6em;
    }

    .landing--container .view {
        width: 100%;
        padding: 1em;
    }

    .view .text {
        text-align: center;
    }

    .titles {
        font-family: Rene;
        margin-bottom: 0.6em;
    }

    @media only screen and (max-width: 768px) {
        .landing--container {
            width: 100%;
        }
    }
</style>
