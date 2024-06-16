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
    margin: 2px 2px 2px 0px;
  }

  button:first-child {
    margin: 2px 2px 2px 2px;
  }

  .active {
    /* TODO: replace the colors with variables */
    background-color: var(--foreground-color);
    color: var(--background-color);

    &.isInverted-false {
      background-color: var(--background-color);
      color: var(--foreground-color);
    }
  }
  .isInverted-false {
    /* filter: invert(1); */
    background-color: rgba(0,0,0,0.2);
    color: var(--background-color);
  }
</style>
