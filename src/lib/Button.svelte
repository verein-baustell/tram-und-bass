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
    min-height: 40px;
  }

  button:first-child {
    margin: 0.12em 0.12em 0.12em 0.12em;
  }

  :hover{
    background: var(--hover-color);
    transition: var(--transition);
    background-size: 2em;

      &.isInverted-false{
        background-color: rgba(0,0,0,0.3);
    }
      &.isSeven {
        background-color: #545454;
      }
  }

  .active {
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
  .isSeven {
    background-color: #222222;
  }

  .btnLine {
    width: 100%;
    margin: 0em 0.12em 0em 0em !important;
  }

  .btnTiny {
    width: inherit !important;
  }

  .btnStation {
    width: 92px;
    margin: 0em 0.12em 0em 0em !important;
  }

  .btnArtist {
    width: 100%;
    max-width: 100%;
    margin: 0em 0em 0em 0em !important;
    overflow: hidden;
    text-overflow: clip !important;
  }

  .btnClose{
    display: none;
    justify-content: center;
    align-items: center;
    padding: 0em !important;
    margin: 0em var(--padding-l) 0em var(--padding-l) !important;
    width: 24px;
  }

  @media only screen and (max-width: 768px) {
    .btnClose{
      display: flex;
    }
    .btnArtist {
      max-width: 210px;
    }
    .btnLine {
      width: 100%;
      margin: 0em 0em 0em 0em !important;
    }
  }
</style>
