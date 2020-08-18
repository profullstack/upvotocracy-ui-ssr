<script>
  import { slide } from 'svelte/transition';
  import { userStore, categories, showOverlay } from '../store';
  import Searchbar from './Searchbar.svelte';
  import Sidebar from '../components/Sidebar.svelte';
  import { onMount } from 'svelte';

  export let inboxCount;
  let filtered = [];
  let search = '';
  let showNsfw = false;

  let cats = [];
  categories.subscribe(value => {
    cats = value;
  });

  let user;
  userStore.subscribe(value => {
    user = value;
  });

  const logout = () => {
    localStorage.removeItem('token');
    userStore.update(() => undefined);
    hideOverlay();
  };

  const hideOverlay = () => {
    showOverlay.set(false);
  };

  function sort(type) {
    filtered = filtered.sort((a, b) => {
      if (type === 'new') {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      } else if (type === 'top') {
        return b.subscriberCount - a.subscriberCount;
      }

      return new Date(a.created).getTime() - new Date(b.created).getTime();
    });
  }

  function filterCategories() {
    filtered = cats.filter(c => {
      if (c.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
        return c;
      }
    });
  }

  onMount(() => {
    filterCategories();
  });
</script>

<style>
  .overlay {
    overflow: scroll;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #eafff6;
    position: fixed;
    z-index: 1;
    top: 6.8rem;
    left: 0;
    text-align: center;
  }
  .close-button {
    position: absolute;
    right: 0;
    top: 0;
    width: 55px;
    height: 55px;
    cursor: pointer;
  }
  .overlay h3 {
    text-decoration: underline;
  }
  .categories {
  }
  .menu {
    position: sticky;
    background-color: #eafff6;
    top: 0;
  }
  .vertical {
    vertical-align: bottom;
  }
  #mail-icon {
    width: 23px;
    fill: white;
  }
  #inbox-count {
    color: white;
    margin-left: 0.2em;
    font-weight: 500;
    font-size: 18px;
  }
  .nsfw {
    color: red;
  }
  .filter-categories {
    width: 60%;
  }
  span {
    color: #13d583;
    font-weight: 500;
    font-size: 24px;
  }
  ul {
    list-style: none;
  }
</style>

<div class="overlay" in:slide={{ duration: 500 }} out:slide={{ duration: 200 }}>
  <div class="menu">
    {#if user}
      <div>
        <a on:click={hideOverlay} href="/compose">
          <button class="navbar-item">Create a post</button>
        </a>
        <a on:click={hideOverlay} href="/newcategory">
          <button class="navbar-item">Create a category</button>
        </a>
      </div>
      <div>
        <a on:click={hideOverlay} href="/inbox">
          <button class="navbar-item vertical">
            <svg
              id="mail-icon"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 512 435"
              xml:space="preserve">
              <g>
                <g>
                  <path
                    d="M496,64H16C7.168,64,0,71.168,0,80v352c0,8.832,7.168,16,16,16h480c8.832,0,16-7.168,16-16V80
                    C512,71.168,504.832,64,496,64z M450.384,96L256,251.504L61.616,96H450.384z
                    M480,416H32V113.28l214,171.2
                    c2.928,2.352,6.464,3.52,10,3.52s7.072-1.168,10-3.504L480,113.28V416z" />
                </g>
              </g>
            </svg>
            <span id="inbox-count">{inboxCount || ''}</span>
          </button>
        </a>
        <a on:click={hideOverlay} href="/u/{user.username}">
          <button class="navbar-item">{user.username.toUpperCase()}</button>
        </a>
        <a on:click={hideOverlay} href="/settings">
          <button class="navbar-item">SETTINGS</button>
        </a>
        <a on:click={logout}>
          <button class="navbar-item">LOGOUT</button>
        </a>
        <a on:click={hideOverlay} href="/home">
          <button class="navbar-item">My Categories</button>
        </a>
      </div>
    {:else}
      <a on:click={hideOverlay} href="/login">
        <button class="navbar-item">LOGIN</button>
      </a>
      <a on:click={hideOverlay} href="/register">
        <button class="navbar-item">REGISTER</button>
      </a>
    {/if}
    <Searchbar />
    <h3>Categories</h3>
    <div class="sort-nav">
      Sort:
      <a href="javascript:void(0)" on:click|preventDefault={() => sort('top')}>Top</a>
      <a href="javascript:void(0)" on:click|preventDefault={() => sort('new')}>New</a>
    </div>
    Show NSFW:
    <input type="checkbox" bind:checked={showNsfw} />
    <br />
    <input
      type="text"
      class="filter-categories"
      placeholder="Filter"
      bind:value={search}
      on:keyup={filterCategories} />
  </div>
  <div class="categories">
    <ul>
      {#each filtered as category}
        {#if (!showNsfw && !category.nsfw) || showNsfw}
          <li>
            <a on:click={hideOverlay} rel="prefetch" href="/a/{category.name}">
              <span>{category.name}</span>
            </a>
            {#if category.nsfw}
              <span class="nsfw">(nsfw)</span>
            {/if}
          </li>
        {/if}
      {/each}
    </ul>
  </div>
</div>
