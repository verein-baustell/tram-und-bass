<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    export let aboutContent: string;
</script>
<div class="view detailed-view about-view">

    <!--
    <p>
        <SvelteMarkdown source={aboutContent} /> 
    </p>

-->
    <div class="about-container text">
        <p>
        <span>Tram und Bass lädt dich ein, verträumt aus dem Tram in die Stadt hinauszuschauen und dabei 30 einzigartige Musikfahrten zu hören. Auf der Musikplattform wird die Vielfalt elektronischer Musik aus Zürich audiovisuell präsentiert und für alle zugänglich gemacht.
        </span>
        <span>Musik, genauso wie Tramfahren, ist ein grosser Bestandteil des Zürcher Soziallebens. Sie verbindet und bringt Menschen zusammen. Während elektronische Musik immer mehr Platz im Internet findet, verliert sie ihren Platz im öffentlichen Raum. Die vielen musikalischen Nischen bilden soziale Subkulturen, welche wiederum als Nährboden für die Diversität der Zürcher Kultur dienen.
        </span>
        <span>In den Tramfahrten zeigen wir nicht nur Techno, sondern die ganze Bandbreite elektronischer Musik von lokaler und internationaler Ausstrahlung. Die Vielfalt der musikalischen Subkultur prägt nicht nur die Nacht, sondern auch den Tag. Also steig ein, wir wünschen viel Spass beim Entdecken.
        </span>
        </p>
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
                <span>Support Tram und Bass auf Bandcamp</span>
            </p>
            <div class="products">
                <img class="pic" src="/images/product1.webp" alt="Bandcamp" />
                <img class="pic" src="/images/product2.webp" alt="Bandcamp" />
             </div>
        </div>
    </a>

    <div class="about-container">
        <p>
            <span>Das Projekt Tram und Bass wurde mit viel Liebe von den Vereinen Baustell und RTFM initiiert und umgesetzt. Unterstützt von:</span>
        </p>
        <div class="unter">
            <a href="https://www.stadt-zuerich.ch/fd/de/index.html"><img class="pic" src="/images/uploads/stadt.png" alt="Stadt Supporter Logo" /></a>
            <a href="https://engagement.migros.ch/de/kulturprozent"><img class="pic" src="/images/uploads/migros.png" alt="Migros Supporter Logo" /></a>
            <a href="https://www.ernst-goehner-stiftung.ch/index.php/de"><img class="pic" src="/images/uploads/ernstgohner.png" alt="Ernst Göhner Supporter Logo" /></a>
            <a href="https://www.stadt-zuerich.ch/vbz/de/index.html"><img class="pic" src="/images/uploads/vbz.png" alt="VBZ Supporter Logo" /></a>
            <a href="https://temperatio.ch/"><img class="pic" src="/images/uploads/temperatio.png" alt="Temperatio Supporter Logo" /></a>
            <a href="https://www.zh.ch/de/direktion-der-justiz-und-des-innern/fachstelle-kultur.html"><img class="pic" src="/images/uploads/kanton.png" alt="Kanton Supporter Logo" /></a>
       </div>
    </div>

    <div class="about-container text">
        <p>
            <span>Impressum</span>
            <span>
                Verein Tram und Bass
                Hardgutstrasse 7
                8048 Zürich
                info@tramundbass.ch
            </span>
        </p>
    </div>
</div>


<style lang="scss" scoped>
    .about-view {
        width: 100%;
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

    .text
{
    background-color: white;
}
    .support{
        background-color: #8B2062;
        color: white;
    }

    .insta{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        column-gap: 0.3em;
    }
    .pic{
        border-radius: 0.3em;
        transition: 0.2s;
    }

    .pic:hover{
        scale: 0.95;
        transition: 0.2s;
        filter: brightness(1.1);
    }

    .c-insta:hover{
        background-color: #E2E2E2;
    }

    .products{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        column-gap: 0.3em;
    }
    .unter{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-top: 1.6em;
        margin-bottom: 0.2em;
        column-gap: 2em;
        row-gap: 1em;
        padding-left: 0.6em;
        padding-right: 0.6em;
    }
</style>