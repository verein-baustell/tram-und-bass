<script lang="ts">
    export let isFilled = false;
    export let noLine = false;
</script>
<div class="circle-line-cont">
  <div class={(isFilled ? 'isFilled': '') + " circle"}></div>
  <div class="{(noLine ? 'noLine': '') + " cirlce-line"}"></div>
</div>

<style lang="scss">
  .circe-line-cont {
    display: flex;
    position: relative;
  }
  .circle {
    position: absolute;
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
  .cirlce-line {
      position: absolute;
      left: calc(var(--distance-to-left-edge) + 0.475em);
      width: 1px;
      height: 32px;
      background: var(--foreground-color);
      transform: translate(-50%, 0);
  }
  .noLine.cirlce-line {
      display: none;
  }
</style>
