<script lang="ts">
    export let isFilled = false;
</script>

<div class={(isFilled ? 'isFilled': '') + " circle"}></div>

<style lang="scss">
  
  .circle {
    border: solid 1px currentColor;
    background-color: var(--background-color);
    border-radius: 999px;
    width: 0.5em;
    height: 0.5em;
    position: relative;
    z-index: 1;
  }
  .isFilled {
    background-color: currentColor;
  }
</style>
