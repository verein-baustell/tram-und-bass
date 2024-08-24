<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    export let aboutContent: string;

</script>
<div class="view">
    <p>
        <SvelteMarkdown source={aboutContent} /> 
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