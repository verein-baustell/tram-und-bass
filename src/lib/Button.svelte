<button {...$$props} on:click>
  <slot></slot>
</button>

<style scoped>
  button {
    padding: 0.5em 1em;
    border: none;
    border-radius: .4em;
    cursor: pointer;
  }
</style>
