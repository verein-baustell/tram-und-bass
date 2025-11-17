<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    export let aboutContent: string;
    import { currentCity } from "../store";
</script>

<div class="view detailed-view about-view">
    <div class="about-container text">
        <div class="text-container">
            <SvelteMarkdown source={$currentCity?.description} />
        </div>
        <!-- <p>
            <SvelteMarkdown source={aboutContent} />
        </p> -->
    </div>
    <a href="https://www.instagram.com/tramundbass">
        <div class="about-container c-insta">
            <p>
                <span>Mehr zu TnB auf Instagram</span>
            </p>
            <div class="insta">
                <img class="pic" src="/images/insta1.webp" alt="Instagram" />
                <img class="pic" src="/images/insta2.webp" alt="Instagram" />
                <img class="pic" src="/images/insta3.webp" alt="Instagram" />
                <img class="pic" src="/images/insta4.webp" alt="Instagram" />
                <img class="pic" src="/images/insta5.webp" alt="Instagram" />
            </div>
        </div>
    </a>

    <a href="https://tramundbass.bandcamp.com/">
        <div class="about-container support">
            <p>
                <span>Support Tram & Bass auf Bandcamp</span>
            </p>
            <div class="products">
                <img class="pic" src="/images/product1.webp" alt="Bandcamp" />
                <img class="pic" src="/images/product2.webp" alt="Bandcamp" />
            </div>
        </div>
    </a>

    <div class="about-container impressum">
        <p class="impressum-title">
            Inhaltliche und rechtliche Verantwortung für Tram & Bass {$currentCity?.name}
            wird übernommen von:
        </p>
        <p style="padding: 0 10px; border-left: 1px solid white">
            {$currentCity?.legal}
        </p>
        <p style="padding-top: 15px; white-space: normal;">
            Tram & Bass {$currentCity?.name} wurde ermöglicht durch die Unterstützung
            von:
        </p>
        <div class="sponsors">
            <div class="unter">
                {#each $currentCity?.sponsorLogos as sponsor}
                    <a href={sponsor.url}>
                        <img
                            class="pic"
                            src={sponsor.logo}
                            alt={sponsor.name}
                        />
                    </a>
                {/each}
            </div>
        </div>
    </div>

    <div class="about-container love">
        <p>
            Die Platform Tram & Bass wurde mit viel Liebe von den Vereinen
            Baustell und RTFM initiiert und umgesetzt.
        </p>
        <p class="love-heart">❤❤❤</p>
        <p style="margin-top: 5px;">
            Für allgemeine Anfragen zum Projekt Tram & Bass und bei Interesse an
            einer Kollaboration schreib uns eine <a
                class="link"
                href="mailto:info@trambass.net">Email</a
            >
            oder Kontaktiere uns auf
            <a class="link" href="https://www.instagram.com/tramundbass/"
                >Instagram</a
            >
            .
        </p>
    </div>
</div>

<style lang="scss" scoped>
    .about-view {
        width: 100%;
        overflow-x: hidden;
    }
    .about-container {
        background-color: #eeeeee;
        border-radius: 0.5em;
        margin: 0.4em;
        padding-left: 0.8em;
        padding-right: 0.8em;
        padding-top: 0.6em;
        padding-bottom: 0.8em;
    }
    p span {
        display: block;
        margin-bottom: 0.4em;
    }

    .text {
        background-color: white;
    }
    .support {
        background-color: #8b2062;
        color: white;
    }

    .insta {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        column-gap: 0.3em;
    }
    .pic {
        border-radius: 0.3em;
        transition: 0.2s;
    }

    .pic:hover {
        scale: 0.95;
        transition: 0.2s;
        filter: brightness(1.1);
    }

    .c-insta:hover {
        background-color: #e2e2e2;
    }

    .products {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 0.3em;
    }
    .unter {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-top: 1.6em;
        margin-bottom: 0.2em;
        column-gap: 2em;
        row-gap: 1em;
        padding-left: 0.6em;
        padding-right: 0.6em;
    }
    .impressum {
        background-color: black;
        color: white;
    }
    .impressum p {
        white-space: pre-line;
    }
    .text-container {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .impressum-title {
        margin-bottom: 15px;
        display: flex;
        flex-direction: row;
        gap: 5px;
        white-space: normal !important;
        // border-bottom: 1px solid white;
        // width: fit-content;
    }
    .impressum-title span {
        margin-bottom: 0;
    }
    .sponsors img {
        filter: brightness(1) invert(1);
        max-height: 35px;
        width: auto;
        margin: 0 auto;
        border-radius: 0;
    }
    .sponsors img:hover {
        filter: brightness(1) invert(1);
    }
    .link {
        color: black;
        text-decoration: underline;
    }
    .link:hover {
        color: #8b2062;
    }
    .love-heart {
        text-align: center;
        transition: 0.2s;
    }
    .love:hover .love-heart {
        color: rgb(227, 0, 0);
        scale: 1.5;
    }
    .love a:hover {
        transition: 0.2s;
        color: rgb(227, 0, 0);
    }
    // .love:hover {
    //     background-color: rgb(227, 0, 0);
    //     transition: 0.2s;
    //     color: white;
    // }
    // .love:hover a {
    //     transition: 0.2s;
    //     color: white;
    // }
</style>
