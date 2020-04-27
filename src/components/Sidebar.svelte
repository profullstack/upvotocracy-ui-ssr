<script>
  import { onMount } from 'svelte'
  import { categories, userStore } from '../store'
  import { addSubscription, removeSubscription } from './editSubscriptions';
  import { abbreviateNumber } from '../utils/abbreviateNumber';
  import { makeApiRequest, globalErrorHandler } from '../components/create-api'

  let filtered = [];
  let search = '';
  let showNsfw = false;

  let user;  
  userStore.subscribe(value => {
    user = value
  })

  let cats;  
  categories.subscribe(value => {
    cats = value
  })

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
      if (c.name.toLowerCase().indexOf(search.toLowerCase()) > -1){
        return c;
      }
    })
  }

  const fetchMe = async () => {
    if (!user) return;
    const user = await makeApiRequest('/me', null, { method: 'GET' })
      .catch(err => globalErrorHandler(err))

    userStore.set(user);
  }

  onMount(async () => {
    fetchMe()
  })

  filterCategories()
</script>
<style>
  .sidebar {
    margin: 0 1rem;
    display: block;
    justify-content: space-between;
    background-color: #f9f9f9;
    width: 200px;
    padding: 0 1rem 1rem;
    height: calc(100vh - 6.8rem);
    width: 25.2rem;
    flex-shrink: 0;
    overflow-y: auto;
    position: sticky;
    top: 6.8rem;
  }

  .sidebar header {
    position: sticky;
    top: 0;
    padding-top: 1rem;
    background-color: #f9f9f9;
  }
  
  .sidebar header .sort-nav {
    padding: 1rem 0;
  }

  .sidebar ul{
    list-style: none;
    margin-bottom: 0px;
  }

  .sidebar input {
    background-color: #fff;
  }

  .join-leave {
    float: right;
  }

  .nsfw {
    color: red;
  }
  
  @media only screen and (max-width: 850px) {
    .sidebar {
      display: none;
    }
  }
</style>

<div class="sidebar">
  <header>
    <h3>Categories</h3>
    <input type="text" bind:value={search} on:keyup={filterCategories} />
    {#if user}
      <a href="/home"><button>My Categories</button></a>
    {/if}
    <div class="sort-nav">
      Sort: 
      <a href="javascript:void(0)" on:click|preventDefault={() => sort('top')}>Top</a>
      <a href="javascript:void(0)" on:click|preventDefault={() => sort('new')}>New</a>
    </div>
    Show NSFW: <input type="checkbox" bind:checked={showNsfw} />
  </header>
  <nav>
    <ul>
    {#each filtered as category}
      {#if (!showNsfw && !category.nsfw) || showNsfw}
      <li>
        <span>{ abbreviateNumber(category.subscriberCount || 0 )}</span>
        <a rel=prefetch href="/a/{ category.name }"><span>{ category.name }</span></a>
        {#if category.nsfw}
          <span class="nsfw">(nsfw)</span>
        {/if}
        {#if user}
          {#if user.subscriptions && user.subscriptions.includes(category._id)}
            <a class="join-leave" href="javascript:void(0)" on:click={() => removeSubscription(category._id)}>Leave</a>
          {:else}
            <a class="join-leave" href="javascript:void(0)" on:click={() => addSubscription(category._id)}>Join</a>
          {/if}
        {/if}
      </li>
      {/if}
    {/each}
    </ul>
  </nav>
</div>