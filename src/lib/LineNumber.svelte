<script lang="ts">
  export let number: number;
  export let isInverted = false;
</script>

<div class={isInverted ? "inverted" : "notInverted"}>
  {number}
</div>

<style scoped lang="scss">
  div {
    font-family: HoloMono;
    aspect-ratio: 1;
    width: 1.75em;
    height: 1.75em;
    display: grid;
    place-items: center;
    border-radius: var(--padding-m);
    
  }
  .inverted {
    color: white;
    border: solid 1px white;
  }
  .notInverted {
    color: black;
    border: solid 1px black;
  }
</style>
