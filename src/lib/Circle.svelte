<script lang="ts">
  export let isFilled = false;
</script>

<div class="circle-line-cont">
  <div class={(isFilled ? "isFilled" : "") + " circle"}></div>
</div>

<style lang="scss">
  .circle {
    position: absolute;
    border: solid 1px currentColor;
    background-color: var(--background-color);
    border-radius: 100%;
    width: var(--circle-size);
    height: var(--circle-size);
    position: relative;
    z-index: 1;
    transition: all 0.3s ease-in-out;
  }
  .isFilled {
    background-color: currentColor;
  }
</style>
