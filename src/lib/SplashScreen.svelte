<script lang="ts">
  export let onClick: () => void;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick();
    }
  }
</script>

<div class="splash" on:click={onClick} on:keydown={handleKeyDown} role="button" tabindex="0">
  <img
    class="logo"
    src="/images/logo.svg"
    width="auto"
    height="auto"
    alt="Tram and Bass Logo"
  />
  <div class="supporters">
    <img class="supporter" src="/images/uploads/stadt.png" alt="Stadt Supporter Logo" />
    <img class="supporter" src="/images/uploads/migros.png" alt="Migros Supporter Logo" />
    <img class="supporter" src="/images/uploads/ernstgohner.png" alt="Ernst Göhner Supporter Logo" />
    <img class="supporter" src="/images/uploads/temperatio.png" alt="Temperatio Supporter Logo" />
    <img class="supporter" src="/images/uploads/kanton.png" alt="Kanton Supporter Logo" />
    <img class="supporter" src="/images/uploads/vbz.png" alt="VBZ Supporter Logo" />
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
