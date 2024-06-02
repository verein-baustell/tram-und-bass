<script>
  export let isActive = false;
</script>

<button {...$$props} class:active={isActive} on:click>
  <slot></slot>
</button>

<style scoped>
  button {
    padding: 0.5em 1em;
    border: none;
    border-radius: .4em;
    cursor: pointer;
  }

  .active {
    /* TODO: replace the colors with variables */
    background-color: black;
    color: white;
  }
</style>
