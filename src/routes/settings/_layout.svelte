<script>
  import { stores } from '@sapper/app';
  import { userStore } from '../../store';
  let page;
  let user;
  const store = stores();

  store.page.subscribe((val) => (page = val));

  userStore.subscribe((val) => (user = val));
</script>

<div class="flex">
  {#if user}
    <nav>
      <a class:selected={page.path == '/settings'} href="/settings"> General Settings </a>
      <a class:selected={page.path == '/settings/invoices'} href="/settings/invoices">
        Your Invoices
      </a>
      <a class:selected={page.path == '/settings/apikeys'} href="/settings/apikeys"> API Keys </a>
    </nav>
    <slot />
  {:else}
    <p>You must be logged in</p>
  {/if}
</div>

<style>
  nav {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    max-width: 393px;
    margin: 15px 0;
    align-self: center;
  }
  nav a {
    font-weight: bold;
    font-size: 13px;
    text-transform: uppercase;
    margin: 0 7px;
  }
  .selected {
    color: var(--btn-bg);
    padding: 3px 10px;
    background: var(--green-accent);
    border-radius: 3px;
  }
  .flex {
    display: flex;
    flex-direction: column;
  }
</style>
