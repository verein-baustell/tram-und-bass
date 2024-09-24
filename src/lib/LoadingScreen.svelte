<script>
  import { scale } from 'svelte/transition';
  import { fade } from 'svelte/transition';
</script>

<div class="con"> 
  <div transition:fade={{ delay: 250, duration: 300 }}>
    <img id="gif" src="/images/IntroShortSimple.gif">
  </div>

  <div transition:scale={{ duration: 400, delay: 200, opacity: 0.0, start: 0.2}}>
    <img
      class="logo bounce"
      src="/images/loading.gif"
      width="auto"
      height="auto"
      alt="TnB Loading Animation"
    />
  </div>
</div>

<style lang="scss" scoped>
  .con{
    z-index: -100;
  }
  div {
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
    pointer-events: none;
  }

    #gif{
    position: fixed;
    top: 0;
    min-height: 100vh;
    scale: 1.1;
    width: auto;
    height: auto;
    filter: saturate(0.01) brightness(0.4) blur(24px);
  }
   .bounce{
        width: 50%;
        object-fit: contain;
        animation: loadingAnimation 2s infinite;
        @keyframes loadingAnimation {
            0% {
                scale: 1;
            }
            50% {
                scale: 1.2;
            }
            100% {
                scale: 1;
            }

        }
    }
</style>
