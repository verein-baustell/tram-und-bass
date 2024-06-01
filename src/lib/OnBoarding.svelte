<script lang="ts">
    export let onClick: () => void;
</script>

<dialog>
  <h1>OnBoarding</h1>
  <p>OnBoarding content</p>
  <button
    on:click={() => {
      onClick();
    }}>Letz Go</button
  >
</dialog>
