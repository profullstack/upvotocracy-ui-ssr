<script>
  export let type = 'down';
  export let selected = false;
  export let click;
</script>

{#if !selected}
  <svg
    on:click={click}
    class="arrow"
    class:down={type == 'down'}
    width="11"
    height="7"
    viewBox="0 0 11 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.36271 7L5.5 2.77995L9.63729 7L11 5.61003L5.5 4.72849e-07L-8.32159e-07 5.61003L1.36271 7Z"
      fill="var(--text-color)"
    />
  </svg>
{:else}
  <svg
    on:click={click}
    class="arrow"
    class:down={type == 'down'}
    width="17"
    height="11"
    viewBox="0 0 17 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.10601 11L8.5 4.36849L14.894 11L17 8.81576L8.5 1.16426e-06L-1.7164e-06 8.81576L2.10601 11Z"
      fill="var(--green-accent)"
    />
  </svg>
{/if}

<style>
  .down {
    transform: rotateX(180deg);
  }
  .arrow {
    cursor: pointer;
  }
</style>
