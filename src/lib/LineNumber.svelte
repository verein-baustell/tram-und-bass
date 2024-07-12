<script lang="ts">
  export let number: number;
  export let isInverted = false;
</script>

<div class={isInverted ? "inverted" : "notInverted"}>
  {number}
</div>

<style scoped lang="scss">
  div {
    color: black;
    font-family: HoloMono;
    aspect-ratio: 1;
    width: 1.75em;
    height: 1.75em;
    display: grid;
    place-items: center;
    /* TODOO: make border with a variable */
    border: solid 1px var(--foreground-color);
    border-radius: var(--padding-m);

    &.notInverted {
      border: solid 1px var(--foreground-color);
      color: var(--foreground-color);
    }
  }
</style>
