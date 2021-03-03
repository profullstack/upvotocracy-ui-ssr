<script>
  import { fly } from 'svelte/transition';
  import { globalError } from '../store';

  let error;
  globalError.subscribe((val) => {
    error = val;
    if (val != null) setTimeout(() => globalError.set(null), 5000);
  });
</script>

{#if error}
  <div class="error-dropdown" transition:fly={{ duration: 500, y: -100 }}>
    <p>{error}</p>
  </div>
{/if}

<style>
  .error-dropdown {
    position: fixed;
    background-color: #ffffff;
    padding: 10px;
    border-radius: 3px;
    top: 61px;
    z-index: 4;
    color: red;
    border: #6f6f6f 2px solid;
    left: 50%;
    transform: translateX(-50.1%);
    max-width: 300px;
    overflow-wrap: anywhere;
  }
</style>
