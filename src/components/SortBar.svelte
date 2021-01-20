<script>
  import { onMount } from 'svelte';
  export let page;
  export let username;
  export let category;
  export let hashtag;
  export let user;
  export let subscriptions;
  export let sort;

  let showDropdown = false;
  let sortChoice;
  $: {
    if (typeof page.query.sort == 'undefined') sortChoice = 'hot';
    else if (page.query.sort == 'not') sortChoice = 'controversial';
    else sortChoice = page.query.sort;
  }

  const isMobile = () => {
    if (screen && screen.width < 750) return true;
    else return false;
  };

  const hideDropdown = () => {
    if (isMobile()) showDropdown = false;
  };

  onMount(() => {
    console.log(isMobile());
    if (isMobile()) showDropdown = false;
    else showDropdown = true;
  });
</script>

<button class="dropdown-btn" on:click={() => (showDropdown = !showDropdown)}>
  {sortChoice}
  <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.88505 0L4.5 3.61719L1.11495 0L0 1.19141L4.5 6L9 1.19141L7.88505 0Z"
      fill="var(--text-color-opposite)"
    />
  </svg>
</button>
{#if showDropdown}
  <nav on:click={hideDropdown}>
    <a
      class:selected={page.query.sort == 'hot' || typeof page.query.sort == 'undefined'}
      rel="prefetch"
      href="{page.path}?sort=hot"> Hot </a>
    <a class:selected={page.query.sort == 'new'} rel="prefetch" href="{page.path}?sort=new">New</a>
    <a class:selected={page.query.sort == 'top'} rel="prefetch" href="{page.path}?sort=top">Top</a>
    <a
      class:selected={page.query.sort == 'comments'}
      rel="prefetch"
      href="{page.path}?sort=comments"> Comments </a>
    <a class:selected={page.query.sort == 'not'} rel="prefetch" href="{page.path}?sort=not">
      Controversial
    </a>
    {#if subscriptions && user}
      <a href={`/api/1/posts/rss/${user.id}`}>RSS</a>
    {:else if hashtag}
      <a href={`/api/1/posts/rss/tags/${hashtag}?sort=${sort}`}> RSS </a>
    {:else}
      <a
        href={`/api/1/${username ? 'user' : 'posts'}/${
          category || username ? (category || username) + '/' : ''
        }rss?sort=${sort}`}> RSS </a>
    {/if}
  </nav>
{/if}

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 393px;
    margin: 15px 5px 15px 5px;
  }
  nav a {
    font-weight: bold;
    font-size: 13px;
    text-transform: uppercase;
  }
  .selected {
    color: var(--text-color-opposite);
    padding: 3px 10px;
    background: var(--green-accent);
    border-radius: 3px;
  }
  .dropdown-btn {
    display: none;
    background-color: var(--green-accent);
    border-radius: 3px;
    padding: 3px 10px;
    color: var(--text-color-opposite);
    margin: 10px;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 13px;
  }
  @media screen and (max-width: 750px) {
    .dropdown-btn {
      display: block;
    }
    nav {
      z-index: 1;
      flex-direction: column;
      max-width: unset;
    }
    nav a {
      margin: 5px;
    }
  }
</style>
