<script lang="ts">
  import { vimeoVideoObject } from "../store";
  import Button from "./Button.svelte";




</script>

<div>
    VideoControls
    <Button
    on:click={() => {
      $vimeoVideoObject.play();
    }}
    >Play</Button>
</div>