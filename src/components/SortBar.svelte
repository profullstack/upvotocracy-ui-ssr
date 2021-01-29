<script>
  import { onMount } from 'svelte';
  import { stores } from '@sapper/app';

  export let username;
  export let category;
  export let hashtag;
  export let user;
  export let subscriptions;
  export let sort;
  export let comments = false;

  let showDropdown = false;
  let sortChoice;
  let page;
  const store = stores();

  store.page.subscribe((val) => (page = val));

  $: {
    if (typeof page.query.sort == 'undefined' && comments == true) sortChoice = 'new';
    else if (typeof page.query.sort == 'undefined') sortChoice = 'hot';
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
    {#if comments}
      <a class:selected={sortChoice == 'new'} rel="prefetch" href="{page.path}?sort=new">New</a>
      <a class:selected={sortChoice == 'top'} rel="prefetch" href="{page.path}?sort=top">Top</a>
      <a class:selected={sortChoice == 'original'} rel="prefetch" href="{page.path}?sort=original"
        >Original</a
      >
    {:else}
      <a
        class:selected={sortChoice == 'hot' || typeof page.query.sort == 'undefined'}
        rel="prefetch"
        href="{page.path}?sort=hot"
      >
        Hot
      </a>
      <a class:selected={sortChoice == 'new'} rel="prefetch" href="{page.path}?sort=new">New</a>
      <a class:selected={sortChoice == 'top'} rel="prefetch" href="{page.path}?sort=top">Top</a>
      <a class:selected={sortChoice == 'comments'} rel="prefetch" href="{page.path}?sort=comments">
        Comments
      </a>
      <a class:selected={sortChoice == 'controversial'} rel="prefetch" href="{page.path}?sort=not">
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
          }rss?sort=${sort}`}
        >
          RSS
        </a>
      {/if}
    {/if}
  </nav>
{/if}

<style>
  nav {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    max-width: 393px;
    margin: 15px 0;
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
