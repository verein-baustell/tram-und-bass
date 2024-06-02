<script lang="ts">
  export let number: number;
</script>

<div>{number}</div>

<style scoped>
  div {
    aspect-ratio: 1;
    width: 2em;
    height: 2em;
    display: grid;
    place-items: center;
    /* TODOO: make border with a variable */
    border: solid 1px black;
  }
</style>
