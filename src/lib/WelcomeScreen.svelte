<script lang="ts">
  import LineList from "./LineList.svelte";
  import { tick } from "svelte";
  import { currentLine } from "../store";
  import { onMount } from "svelte";
  import Button from "./Button.svelte";
  import LineNumber from "./LineNumber.svelte";
  import { clickoutside } from "@svelte-put/clickoutside";
  import { vimeoVideoObject, cookieConsent, videoIsLoading } from "../store";
  import { giveConsent } from "../utils/cookieManager";
  export let line: Line;

  // Wait for $vimeoVideoObject to be defined
  async function waitForVimeoVideoObject() {
    while (!$vimeoVideoObject) {
      console.log($vimeoVideoObject);
      await tick(); // Wait for the next DOM update
    }
  }

  // Handle the button click, wait for $vimeoVideoObject if necessary
  const handleButtonClick = async () => {
    giveConsent(); // Give cookie consent
    videoIsLoading.set(true);

    // Wait for the Vimeo object to be defined
    await waitForVimeoVideoObject();

    $vimeoVideoObject.play();
  };
</script>

<div id="welcome-screen">
  <div class="landing--container">
    <img
      class="logo"
      src="/images/TnB_wordmark_orange.svg"
      alt="Tram und Bass"
    />

    {#if !$cookieConsent}
      <div class="view view--flex">
        <p class="titles">Cookies</p>
        <p>
          Wir verwenden Cookies von Drittanbietern, darunter Vimeo. Durch das
          Klicken auf den unten stehenden Button stimmst du dem zu.
        </p>
        <div class="line--cont" style="background-color: {line.color};">
            <div class="numb">
              <LineNumber number={line.number} isInverted={!line.isInverted} />
            </div>
            <Button
              class="{line?.number === 7 ? 'isSeven': ''} isInverted-{line.isInverted}"
              isActive={false}
              on:click={handleButtonClick}
              >Zustimmen und gut Festhalten!
            </Button>
        </div>
      </div>
    {/if}

    <div class="view">
      <p class="titles">Links</p>
      <Button
        isActive={true}
        onclick="location.href='https://www.instagram.com/tramundbass/'"
      >
        Instagram
      </Button>
    </div>

    <div class="view">
      <p class="titles">Ganz viel Liebe</p>
      <div class="logo--cont">
        <img src="/images/baustell.svg" alt="Verein Baustell Logo" />
        <img src="/images/rtfm.svg" alt="Verein RTFM Logo" />
      </div>
    </div>

    <div class="view">
      <p class="titles">Kontakt</p>
      <p class="text">
        <b>Verein Tram und Bass </b>
        <br />
        Hardgutstrasse 7
        <br />
        8048 Zürich
        <br />
        <a href="mailto:info@tramundbass.ch">info@tramundbass.ch</a>
      </p>
    </div>
  </div>
</div>

<style lang="scss" scoped>
  #welcome-screen {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: scroll;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;
  }

  #welcome-screen::-webkit-scrollbar {
    display: none;
  }

  .landing--container {
    display: flex;
    flex-flow: column nowrap;
    text-align: center;
    align-items: center;
    width: 40%;
    height: fit-content;
    margin: var(--global-padding);
    gap: 0.4em;
    margin-bottom: 4em;
  }

  .logo {
    padding-top: 4em;
  }

  .landing--container .view {
    width: 100%;
    padding: 1em;
  }

  .view--flex {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }

  .line--cont {
    display: flex;
    width: fit-content;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    // background-color: #ff6213;
    border-radius: var(--border-radius-view);
    padding: 0.12em;
    margin-top: 0.6em;
    animation: pulse 4s ease-in-out infinite;
  }

  .numb {
    margin-left: var(--padding-l);
    margin-right: var(--padding-l);
  }

  .logo--cont {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .logo--cont img {
    width: 80%;
    margin: 2em auto;
  }

  .view .text {
    text-align: center;
  }

  .titles {
    font-family: Rene;
    margin-bottom: 0.6em;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @media only screen and (max-width: 768px) {
    .landing--container {
      width: 100%;
    }
  }
</style>
