<script lang="ts">
  import { currentLine, isMenuClosed, currentStation, isBtmOpen, isTopOpen, isMobile } from "../store";
  import LineNumber from "./LineNumber.svelte";
  import ChangeLineList from "./ChangeLineList.svelte";
  import StationList from "./StationList.svelte";
  import Artist from "./Artist.svelte";
  import Button from "./Button.svelte";
  import { clickoutside } from "@svelte-put/clickoutside";
  type ComponentType =
    | typeof ChangeLineList
    | typeof StationList
    | typeof Artist;
  let menuEntries: { name: string; component: ComponentType }[];
  let currentComponent: ComponentType;
  $: if ($currentLine) {
    menuEntries = [
      { name: $currentLine.name, component: ChangeLineList },
      { name: "Stationen", component: StationList },
      { name: $currentLine.artistName, component: Artist },
    ];
    currentComponent = menuEntries?.[0]?.component;
  }
  $: if ($currentStation && !$isBtmOpen && !$isTopOpen) {
    isBtmOpen.set(true)
    currentComponent = menuEntries[0]?.component; // Open the first menu entry by default
  }

  $: if ($currentStation == undefined) {
    isBtmOpen.set(false)
  }
</script>

<div
  id="bottom-menu"
  use:clickoutside
  on:clickoutside={() => {
    isBtmOpen.set(false)
  }}
>
  {#if $isBtmOpen}
    <svelte:component this={currentComponent} />
  {/if}
  <nav style:background-color={$currentLine.color}>
    <div class="btm-menu-section">
      <div class="numb">
        <LineNumber
          number={$currentLine.number}
          isInverted={$currentLine.isInverted}
        />
      </div>
      {#each menuEntries as { name, component }, index (name)}
      {#if index === 0}
        <Button
          isActive={currentComponent === component && $isBtmOpen}
          class="isInverted-{$currentLine.isInverted} {$currentLine.number === 7 ? 'isSeven' : ''} btn-btm-menu btn-btm-menu--first"
          on:click={() => {
            if ($isBtmOpen && currentComponent === component) {
              isBtmOpen.set(false)
              return;
            }
            currentComponent = component;
            isBtmOpen.set(true)
          }}
          style={currentComponent === component && $isBtmOpen ? `color: ${$currentLine.color}` : ``}
        >
          {name}
        </Button>
      {/if}
    {/each}
    </div>
    {#if !$isMenuClosed}
      <div class="btm-menu-section">
        {#each menuEntries as { name, component }, index (name)}
          {#if index != 0}
            <Button
              isActive={currentComponent === component && $isBtmOpen}
              class="isInverted-{$currentLine.isInverted} {$currentLine.number ===
              7
                ? 'isSeven'
                : ''} btn-btm-menu"
              on:click={() => {
                if ($isBtmOpen && currentComponent === component) {
                  isBtmOpen.set(false)
                  return;
                }
                currentComponent = component;
                isBtmOpen.set(true)
              }}
              style={currentComponent === component && $isBtmOpen
                ? `color: ${$currentLine.color}`
                : ``}
            >
              {#if name === "Endstation Altes Krematorium" && $isMobile === true}
                <div style="overflow: hidden">
                  <div class="marquee">{name}</div>
                </div>
              {:else}
                {name}
              {/if}
            </Button>
          {/if}
        {/each}
        <div class="close-btn">
          <Button
            class="btn-btm-menu--close"
            style="background-color: {$currentLine.color}"
            on:click={() => {
              $isMenuClosed = true;
              isBtmOpen.set(true)
            }}
          >
            <img
              class="star isInverted-{$currentLine.isInverted}"
              src="/images/close.svg"
              alt="-"
            />
          </Button>
        </div>
      </div>
    {/if}
  </nav>
</div>

<style lang="scss" scoped>
  #bottom-menu {
    display: flex;
    flex-flow: column wrap;
    margin: var(--global-padding);
    position: fixed;
    bottom: 0;
    right: 0;
  }

  .numb {
    margin-left: var(--padding-l);
    margin-right: var(--padding-l);
    filter: invert(1);
  }
  nav {
    display: flex;
    flex-flow: row nowrap;
    width: fit-content;
    align-self: flex-end;
    border-radius: var(--border-radius-view);
    align-items: center;
    background-color: var(--background-color-light);
  }

  .btm-menu-section {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }
  .close-btn {
    display: none;
  }

  .marquee {
      overflow: hidden;
      white-space: nowrap;
      box-sizing: border-box;
      animation: marquee 10s ease-in-out infinite;
    }

    @keyframes marquee {
      0% {
        transform: translateX(0%);
      }
      50% {
        transform: translateX(-5%);
      }
      100% {
        transform: translateX(0%);
      }
    }

  @media only screen and (max-width: 768px) {
    #bottom-menu {
      left: 0;
      right: inherit;
    }
    nav {
      max-width: calc(100vw - var(--global-padding) - var(--global-padding));
      flex-flow: wrap;
    }
    .close-btn {
      display: flex;
    }
    .isInverted-false {
      filter: invert(1);
    }
    .isInverted-true {
      filter: invert(0);
    }
  }
</style>
