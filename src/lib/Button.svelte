<script>
  export let isActive = false;
</script>

<button {...$$props} class:active={isActive} on:click>
  <slot></slot>
</button>

<style scoped lang="scss">
  button {
    background-color: white;
    padding: 0.5em 0.8em;
    border: none;
    border-radius: var(--border-radius-button);
    cursor: pointer;
    margin: 0.12em 0.12em 0.12em 0em;
    transition: var(--transition);
  }

  button:first-child {
    margin: 0.12em 0.12em 0.12em 0.12em;
  }

  :hover{
    background: var(--hover-color);
    transition: var(--transition);
    background-image: url("/images/patternDots.png");
    background-size: 2em;
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
