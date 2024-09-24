<script>
  import { scale } from 'svelte/transition';
</script>
<div transition:scale={{ duration: 400, delay: 200, opacity: 0.0, start: 0.2}}>
  <img
    class="logo"
    src="/images/loading.gif"
    width="auto"
    height="auto"
    alt="TnB Loading Animation"
  />
</div>

<style lang="scss" scoped>
  div {
    position: absolute;
    top: 0;
    z-index: 4000;
    left: 0;
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
    pointer-events: none;
    img{
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
  }
</style>
