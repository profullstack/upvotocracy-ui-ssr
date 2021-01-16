<script>
  import { userStore } from '../../store';
  import { addSubscription, removeSubscription } from '../../api/editSubscriptions';

  export let categoryID;
  let subscribed;

  let user;
  userStore.subscribe((val) => (user = val));

  $: subscribed =
    user && user.subscriptions && user.subscriptions.includes(categoryID) ? true : false;

  const clicked = () => {
    if (subscribed) removeSubscription(categoryID);
    else addSubscription(categoryID);
  };
</script>

{#if user}
  <span on:click={clicked} class:subscribed class:not-subscribed={!subscribed}>
    {#if subscribed}
      <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          class:subscribed
          d="M2.29757 6L0 3.60232L1.04704 2.50965L2.29757 3.81853L5.95296 0L7 1.09266L2.29757 6Z"
          fill="#1B1F1E"
        />
      </svg>
    {:else}
      <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.11002 0.120117H2.31002V2.21895H0.210022V4.02129H2.31002V6.12012H4.11002V4.02129H6.21002V2.21895H4.11002V0.120117Z"
          fill="#666666"
        />
      </svg>
    {/if}
  </span>
{/if}

<style>
  span.subscribed {
    background-color: var(--green-accent);
  }
  span {
    display: inline-flex;
    padding: 6px;
    border-radius: 3px;
    background-color: #bdbdbd;
    float: right;
    cursor: pointer;
  }
  svg path {
    fill: var(--text-color-opposite);
  }
  :global([data-theme='dark']) .not-subscribed {
    background-color: #000000;
  }
  :global([data-theme='dark']) svg path {
    fill: #666666;
  }
  :global([data-theme='dark']) svg path.subscribed {
    fill: #1b1f1e;
  }
</style>
