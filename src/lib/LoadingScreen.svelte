<div>
  <img
    class="logo"
    src="/images/tram_bass_2-15.png"
    width="auto"
    height="auto"
    alt="Tram and Bass Logo"
  />
</div>

<style lang="scss" scoped>
  div {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
    img{
        width: 50%;
        object-fit: contain;
        animation: loadingAnimation 2s infinite;
        @keyframes loadingAnimation {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0.4;
            }
            100% {
                opacity: 1;
            }

        }
    }
  }
</style>
