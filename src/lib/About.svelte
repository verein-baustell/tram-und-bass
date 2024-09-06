<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    export let aboutContent: string;

</script>
<div class="view top-view">
    <p>
        <SvelteMarkdown source={aboutContent} /> 
    </p>

    <p>
    Tram und Bass lädt dich ein, verträumt aus dem Tram in die Stadt hinauszuschauen und dabei 30 einzigartige Musikfahrten zu hören. Auf der Musikplattform wird die Vielfalt elektronischer Musik aus Zürich audiovisuell präsentiert und für alle zugänglich gemacht.
    </p>
    <p>
    Musik, genauso wie Tramfahren, ist ein grosser Bestandteil des Zürcher Soziallebens. Sie verbindet und bringt Menschen zusammen. Während elektronische Musik immer mehr Platz im Internet findet, verliert sie ihren Platz im öffentlichen Raum. Die vielen musikalischen Nischen bilden soziale Subkulturen, welche wiederum als Nährboden für die Diversität der Zürcher Kultur dienen.
    </p>
    <p>  
    In den Tramfahrten zeigen wir nicht nur Techno, sondern die ganze Bandbreite elektronischer Musik von lokaler und internationaler Ausstrahlung. Die Vielfalt der musikalischen Subkultur prägt nicht nur die Nacht, sondern auch den Tag. Also steig ein, wir wünschen viel Spass beim Entdecken.
    </p>
    <p>
    Das Projekt Tram und Bass wurde mit viel Liebe von den Vereinen Baustell und RTFM initiiert und umgesetzt. Dabei wurden wir finanziell unterstützt von Finanzdepartement der Stadt Zürich, Migros Kulturprozent, Ernst Göhner Stiftung, Stiftung Temperatio und Kanton Zürich Kulturstiftung | Swisslos. Die Verkehrsbetriebe Zürich und alle Musiker*innen halfen auch kräftig mit.
    </p>

        <div class="supporters">
            <img class="supporter" src="/images/Stadt.png" />
            <img class="supporter" src="/images/Migros.png" />
            <img class="supporter" src="/images/ErnstGohner.png" />
            <img class="supporter" src="/images/Temperatio.png" />
            <img class="supporter" src="/images/Kanton.png" />
            <img class="supporter" src="/images/VBZ.png" />
          </div>
    
</div>