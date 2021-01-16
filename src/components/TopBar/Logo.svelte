<script>
  import { darkTheme } from '../../store';

  let dark;
  darkTheme.subscribe((val) => (dark = val));
</script>

{#if dark}
  <img src="images/logo-light.svg" alt="logo" />
{:else}<img src="images/logo-dark.svg" alt="logo" />{/if}

<style>
</style>
