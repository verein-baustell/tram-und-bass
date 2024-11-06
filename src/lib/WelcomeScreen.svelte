<script lang="ts">
  import LineList from "./LineList.svelte";
  import { tick } from "svelte";
  import { onMount } from "svelte";
  import Button from "./Button.svelte";
  import { clickoutside } from "@svelte-put/clickoutside";
  import {
    vimeoVideoObject,
    videoIsPlaying,
    currentLine,
    cookieConsent,
  } from "../store";
  import { giveConsent } from "../utils/cookieManager";

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

    // Wait for the Vimeo object to be defined
    await waitForVimeoVideoObject();

    $vimeoVideoObject.play();
  };
</script>

<div id="welcome-screen">
  <div class="landing--container">
    <h1>Willkommen bei Tram und Bass</h1>
    {#if !$cookieConsent}
      <div>
        Wir verwenden Cookies von Drittanbietern, darunter Vimeo. Durch das
        Klicken auf den unten stehenden Button stimmen Sie dem zu.
      </div>
    {/if}
    <Button on:click={handleButtonClick}>Einsteigen!</Button>
  </div>
</div>

<style lang="scss" scoped>
  #welcome-screen {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .landing--container {
    position: absolute;
    display: flex;
    flex-flow: column wrap;
    text-align: center;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30%;
    height: 300px;
    background-color: white;
    border-radius: var(--border-radius-view);
  }
</style>
