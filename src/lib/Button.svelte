<script>
  export let isActive = false;
</script>

<button {...$$props} class:active={isActive} on:click>
  <slot></slot>
</button>

<style scoped lang="scss">
  button {
    padding: 0.5em 0.8em;
    border: none;
    border-radius: .4em;
    cursor: pointer;
  }

  .active {
    /* TODO: replace the colors with variables */
    background-color: black;
    color: white;

    &.isInverted-false {
      background-color: white;
      color: black;
    }
  }
  .isInverted-false {
    /* filter: invert(1); */
    background-color: rgba(0,0,0,0.2);
    color: white;
  }
</style>
