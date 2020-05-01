<script>
  import Post from './Post.svelte'
  import { onMount, getContext } from 'svelte'
  import { userStore, currentCategory } from '../store'
  import { abbreviateNumber } from '../utils/abbreviateNumber';
  import { timeSince } from '../utils/time';
  import { addSubscription, removeSubscription } from './editSubscriptions';
  import { makeApiRequest, globalErrorHandler } from '../components/create-api'

  export let username = null
  export let category = null
  export let subscriptions = null
  export let searchResults = null
  export let posts = []
  export let page;
  export let morePosts = false
  export let sort = '-rank'
  export let categoryData = {}
  export let pageUser
  let pageNumber = 1

  $: {
    page
    pageNumber = 1
  }

  let currentCat
  currentCategory.subscribe(value => {
    currentCat = value
  })

  let user

  userStore.subscribe(value => {
    if (value) {
      user = value
    }
  })

  onMount(() => {
    const rss = document.querySelector('link[type="application/rss+xml"]');
          
    if (category) {
      rss.setAttribute('href', `https://upvotocracy.com/api/1/posts/${category}/rss?sort=-created`);
      rss.setAttribute('title', `Upvotocracy ${category} RSS Feed`);
      currentCategory.set(category)
    }
    else {
      rss.setAttribute('href', `https://upvotocracy.com/api/1/posts/rss?sort=-created`);
      rss.setAttribute('title', `Upvotocracy RSS Feed`);
    }
  })

  const fetchPost = async () => {
    pageNumber += 1;

    let url = ''
    let noauth = true

    if (username) url += `/user/${username}?sort=${sort}&page=${pageNumber}`
    else if (category) url += `/posts/${category}?sort=${sort}&page=${pageNumber}`
    else if (subscriptions) {
      pageNumber-= 1
      noauth = false
      url += `/subscriptions?sort=${sort}&page=${pageNumber}`
      pageNumber += 1
    }
    else url += `/posts?sort=${sort}&page=${pageNumber}`

    let res = await makeApiRequest(url, null, { method: 'GET', noauth })
      .catch(err => globalErrorHandler(err));

    if (!res) return
      
    morePosts = res.more
    posts = posts.concat(res.posts)
  }
</script>
<style>
  .load-more {
    text-align: center;
  }
  .topnav {
    margin: 1rem;
  }
  .topnav a {
    margin-right: .5rem;
  }
  .category {
    margin-bottom: 0.8rem;
  }
  .subscriber-count {
    font-size: 1.8rem;
  }
</style>

<svelte:head>
  <meta property="og:image" content="https://upvotocracy.com/images/title.png" />
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:image" content="https://upvotocracy.com/images/title.png" />
  {#if categoryData}
    <meta property="og:description" content={categoryData.description}>
    <meta property="description" content={categoryData.description}>
    <meta property="og:title" content="{category} - upvotocracy.com">
    <meta property="og:url" content="BASE_URL/a/{category}">
    <meta name="twitter:title" content="{category} - upvotocracy.com">
    <meta name="twitter:url" content="BASE_URL/a/{category}">
  {:else}
    <meta property="og:title" content="Zero-moderation Reddit clone - Upvotocracy.com" />
    <meta property="og:url" content="https://upvotocracy.com" />
    <meta property="og:description" content="Zero-moderation Reddit clone - Upvotocracy.com">
    <meta name="twitter:title" content="Zero-moderation Reddit clone - Upvotocracy.com" />
    <meta name="twitter:url" content="https://upvotocracy.com/" />
    <meta name="description" content="Zero-moderation Reddit clone - Upvotocracy.com" />
  {/if}
</svelte:head>

{#if category}
  <h4 class="category">
    <a href={`/a/${category}`}>a/{category}</a> · 
    <span class="subscriber-count">{ categoryData.subscriberCount || 0 } { categoryData.subscriberCount == 1 ? 'Subscriber' : 'Subscribers'}</span>
  </h4>
  {#if user}
    {#if user.subscriptions && user.subscriptions.includes(categoryData._id)}
      <button href="javascript:void(0)" on:click={() => removeSubscription(categoryData._id)}>Leave</button>
    {:else}
      <button href="javascript:void(0)" on:click={() => addSubscription(categoryData._id)}>Join</button>
    {/if}
  {/if}
  <div>{ categoryData.description }</div>
  {#if categoryData.owner}
    <div>Created by <a href={`/u/${categoryData.owner.username}`}>{ categoryData.owner.username }</a> {timeSince(categoryData.created)} ago.</div>
  {/if}
{:else if pageUser}
  <h4>
    <a href={`/u/${pageUser.username}`}>u/{pageUser.username} ({abbreviateNumber(pageUser.karma || 0)})</a>
  </h4>
  <div class="bio">
    {#if pageUser.bitcoinAddress}
    <div>Bitcoin: <a href={`bitcoin:${pageUser.bitcoinAddress}`}>{pageUser.bitcoinAddress}</a></div>
    {/if}
    {#if pageUser.links.length}
    <div>Links:</div>
    <ul class="links">
      {#each pageUser.links as link}
        <li><a href={link.url} target="_new">{link.name}</a></li>
      {/each}
    </ul>
    {/if}
  </div>
  {#if pageUser.created}
  <p>Joined {timeSince(pageUser.created)} ago</p>
  {/if}
{/if}

{#if !searchResults}
  <nav class="topnav">
    <a rel=prefetch href="{page.path}?sort=hot">Hot</a>
    <a rel=prefetch href="{page.path}?sort=new">New</a>
    <a rel=prefetch href="{page.path}?sort=top">Top</a>
    <a rel=prefetch href="{page.path}?sort=comments">Comments</a>
    <a rel=prefetch href="{page.path}?sort=not">Controversial</a>
    {#if subscriptions && user}
      <a href={`/api/1/posts/rss/${user.id}`}>RSS</a>
    {:else}
      <a href={`/api/1/${(username ? 'user' : 'posts' )}/${category || username ? (category || username)+'/' : ''}rss?sort=${sort}`}>RSS</a>
    {/if}
  </nav>
{/if}
{#each posts as post}
  {#if !post.category.nsfw || subscriptions || category || pageUser}
    <Post { post }></Post>
  {/if}
{/each}

{#if posts.length > 0 && morePosts}
  <div class="load-more">
    <button on:click={fetchPost} rel="next">Load More</button>
  </div>
{/if}