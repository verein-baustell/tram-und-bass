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
    color: black;
    border: none;
    border-radius: var(--border-radius-button);
    cursor: pointer;
    margin: 0.12em 0.12em 0.12em 0em;
    transition: var(--transition);
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }

  button:first-child {
    margin: 0.12em 0.12em 0.12em 0.12em;
  }

  @media only screen and (max-width: 768px) {
    .btn-btm-menu {
      width: 100%;
      &--first {
        margin: 0.12em 0.12em 0em 0.12em;
      }
    }
  }

  :hover{
    background: var(--hover-color);
    transition: var(--transition);
    //background-image: url("/images/patternDots.png");
    background-size: 2em;

      &.isInverted-false{
        background-color: rgba(0,0,0,0.3);
    }
  }

  .active {
    /* TODO: replace the colors with variables */
    background-color: var(--foreground-color);
    color: var(--background-color);

    &.isInverted-false {
      background-color: var(--background-color);
      color: var(--foreground-color);
    }
    &.isInverted-true {
      background-color: black;
      color: var(--foreground-color);
    }
  }
  .isInverted-false {
    background-color: rgba(0,0,0,0.2);
    color: var(--background-color);
  }

  .isInverted-true {
    background-color: rgba(0,0,0,0.2);
    color: black;
  }
</style>
