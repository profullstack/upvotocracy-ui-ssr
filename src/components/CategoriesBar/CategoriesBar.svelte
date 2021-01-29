<script>
  import SearchBar from '../SearchBar.svelte';
  import Category from './Category.svelte';
  import HideToggle from './HideToggle.svelte';
  import { fly } from 'svelte/transition';
  import { showCategoriesBar, showNotificationsBar } from '../../store';

  export let cats;
  let filtered = [];
  let search = '';
  let hideNsfw = true;
  let sortBy = 'top';
  let show;

  showCategoriesBar.subscribe((value) => {
    show = value;
    if (typeof screen !== 'undefined' && screen.width < 750) showNotificationsBar.set(false);
  });

  function sort(type) {
    sortBy = type;
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
    filtered = cats.filter((c) => {
      if (c.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
        return c;
      }
    });
  }

  filterCategories();

  $: {
    search;
    filterCategories();
  }
</script>

{#if show}
  <div class="sticky-sidebar categories" transition:fly={{ x: -350, opacity: 1 }}>
    <header>
      <h3>Categories</h3>
      <a rel="prefetch" href="/mycategories"><button>My Categories</button></a>
      <SearchBar bind:search />
      <HideToggle bind:toggleOn={hideNsfw} />
      <div class="sort-container">
        <span class="sort">Sort:</span>
        <span
          class="sort-option"
          class:sort-selected={sortBy == 'top'}
          on:click|preventDefault={() => sort('top')}>Top</span
        >
        <span
          class="sort-option"
          class:sort-selected={sortBy == 'new'}
          on:click|preventDefault={() => sort('new')}>New</span
        >
      </div>
    </header>
    {#each filtered as category}
      {#if (hideNsfw && !category.nsfw) || !hideNsfw}
        <Category {category} />
      {/if}
    {/each}
  </div>
{/if}

<style>
  .categories {
    width: 300px;
  }
  .sort-container {
    font-size: 14px;
  }
  .sort-container > span {
    margin: 0 2.5px 0 2.5px;
  }
  .sort {
    color: #666666;
  }
  .sort-selected {
    color: var(--green-accent);
    font-weight: bold;
  }
  .sort-option {
    cursor: pointer;
    user-select: none;
  }
  h3 {
    font-weight: bold;
    font-size: 19px;
    margin: 0;
  }
  button {
    text-transform: uppercase;
    font-size: 13px;
    background-color: var(--green-accent);
    border-radius: 3px;
    font-weight: bold;
    color: var(--text-color-opposite);
    padding: 3px 10px 3px 10px;
  }
  :global([data-theme='dark']) button {
    color: #1b1f1e;
  }
  header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    height: 150px;
    margin: 0 0 5px 0;
    position: sticky;
    top: 0px;
    padding-top: 10px;
    background-color: var(--sidebar-bg);
  }

  @media screen and (max-width: 750px) {
    .categories {
      position: fixed;
    }
  }
</style>
