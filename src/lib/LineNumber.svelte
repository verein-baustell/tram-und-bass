<script lang="ts">
  export let number: number;
  export let isInverted = false;
</script>

<div class={isInverted ? "inverted" : "notInverted"}>
  {number}
</div>

<style scoped lang="scss">
  div {
    aspect-ratio: 1;
    width: 1.75em;
    height: 1.75em;
    display: grid;
    place-items: center;
    /* TODOO: make border with a variable */
    border: solid 2px var(--foreground-color);
    border-radius: 0.4em;
    margin: 0rem 0.5em 0em 0.5em;

    &.notInverted {
      border: solid 2px var(--background-color);
      color: var(--background-color);
    }
  }
</style>
