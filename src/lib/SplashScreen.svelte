<div class="splash">
  <img
    class="logo"
    src="/images/tram_bass_2-15.png"
    width="auto"
    height="auto"
  />
  <div class="supporters">
    <img class="supporter" src="/images/Stadt.png" />
    <img class="supporter" src="/images/Migros.png" />
    <img class="supporter" src="/images/ErnstGohner.png" />
    <img class="supporter" src="/images/Temperatio.png" />
    <img class="supporter" src="/images/Kanton.png" />
    <img class="supporter" src="/images/VBZ.png" />
  </div>
</div>

<style lang="scss">
  .splash {
    pointer-events: none;
    z-index: 1000;
    display: none;
    height: 100vh;
    width: 100vw;
    margin: 0;
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .logo {
    width: auto;
    height: 300px;
    margin: auto;
  }

  .supporters {
    display: flex;
    justify-content: space-between;
    margin-left: auto;
    margin-right: auto;
    width: calc(100vw - 1.6em);
    padding: 1em;
    align-items: center;
    border-radius: var(--border-radius-view);
    background-color: var(--background-color);
  }

  .supporter {
    height: 30px;
    width: auto;
  }
</style>
