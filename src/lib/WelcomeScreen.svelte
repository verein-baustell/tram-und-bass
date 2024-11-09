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
    videoIsLoading,
  } from "../store";
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
    <h1>Willkommen bei Tram und Bass</h1>
    {#if !$cookieConsent}
      <div>
        Wir verwenden Cookies von Drittanbietern, darunter Vimeo. Durch das
        Klicken auf den unten stehenden Button stimmst du dem zu.
      </div>
    {/if}
    <button
      class:isInverted={line.isInverted}
      class="start"
      style="background: {line.color};"
      on:click={handleButtonClick}>Gut Festhalten!</button
    >
  </div>
</div>

<style lang="scss" scoped>
  #welcome-screen {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .landing--container {
    padding: 10px;
    position: absolute;
    display: flex;
    flex-flow: column wrap;
    text-align: center;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 20px);
    max-width: 500px;
    height: auto;
    background-color: white;
    border-radius: var(--border-radius-view);
  }

  .isInverted {
    color: black !important;
  }
  button.start {
    position: relative;
    background-color: var(--background-color);
    border: none;
    color: white;
    cursor: pointer;
    // width: 100%;
    padding: var(--padding-m);
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 20px;
    border-radius: var(--border-radius-button);
    align-items: center;
    gap: 0.5em;
    transition: var(--transition);
    line-height: 1.75em;
  }

  /* Media query for screens smaller than 600px */
  @media (max-width: 500px) {
    button.start {
      width: 100%;
    }
  }
</style>
