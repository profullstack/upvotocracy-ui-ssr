<script>
  import Post from "./Post.svelte";
  import { onMount, getContext } from "svelte";
  import { userStore, currentCategory } from "../store";
  import { abbreviateNumber } from "../utils/abbreviateNumber";
  import { timeSince } from "../utils/time";
  import { addSubscription, removeSubscription } from "./editSubscriptions";
  import { makeApiRequest, globalErrorHandler } from "../components/create-api";

  export let username = null;
  export let category = null;
  export let subscriptions = null;
  export let searchResults = null;
  export let posts = [];
  export let page;
  export let morePosts = false;
  export let sort = "-rank";
  export let categoryData;
  export let pageUser;
  let previousURL;
  let nextURL;
  let currentURL;

  let currentCat;
  currentCategory.subscribe(value => {
    currentCat = value;
  });

  let user;

  userStore.subscribe(value => {
    if (value) {
      user = value;
    }
  });

  onMount(() => {
    const rss = document.querySelector('link[type="application/rss+xml"]');

    if (category) {
      rss.setAttribute(
        "href",
        `SITE_URL/api/1/posts/${category}/rss?sort=-created`
      );
      rss.setAttribute("title", `SITE_NAME ${category} RSS Feed`);
      currentCategory.set(category);
    } else {
      rss.setAttribute("href", `SITE_URL/api/1/posts/rss?sort=-created`);
      rss.setAttribute("title", `SITE_NAME RSS Feed`);
    }
  });

  const fetchPost = async () => {
    let pageNumber;
    let currentURL = new URLSearchParams(window.location.search);

    if (currentURL.get("page"))
      pageNumber = parseInt(currentURL.get("page")) + 1;
    else pageNumber = 1;

    updateUrl(pageNumber);

    let url = "";
    let noauth = true;

    if (username) url += `/user/${username}?sort=${sort}&page=${pageNumber}`;
    else if (category)
      url += `/posts/${category}?sort=${sort}&page=${pageNumber}`;
    else if (subscriptions) {
      noauth = false;
      url += `/subscriptions?sort=${sort}&page=${pageNumber}`;
    } else url += `/posts?sort=${sort}&page=${pageNumber}`;

    let res = await makeApiRequest(url, null, { method: "GET", noauth }).catch(
      err => globalErrorHandler(err)
    );

    if (!res) return;

    morePosts = res.more;
    posts = posts.concat(res.posts);
  };

  const updateUrl = pageNumber => {
    const currentURL = new URL(window.location.href);
    const searchParams = currentURL.searchParams;
    searchParams.set("page", pageNumber);
    currentURL.search = searchParams.toString();

    history.pushState({}, "", currentURL);
  };

  const getNextUrl = () => {
    if (typeof page == 'undefined') return;
    if (typeof page.query == 'undefined') return;
    
    if (page.query.page) page.query.page = parseInt(page.query.page);
    else page.query.page = 0;

    let queries = "";
    Object.keys(page.query).forEach((key, i) => {
      queries += `${key}=${page.query[key]}${
        i != Object.keys(page.query).length - 1 ? "&" : ""
      }`;
    });

    const url = new URL(`${'BASE_URL'}${page.path}?${queries}`);
    currentURL = url.href;

    url.searchParams.set("page", parseInt(page.query.page) - 1);
    previousURL = url.href;

    url.searchParams.set("page", parseInt(page.query.page) + 1);
    nextURL = url.href;
  };
  getNextUrl()
</script>

<style>
  .load-more {
    text-align: center;
  }
  .topnav {
    margin: 1rem;
  }
  .topnav a {
    margin-right: 0.5rem;
  }
  .category {
    margin-bottom: 0.8rem;
  }
  .subscriber-count {
    font-size: 1.8rem;
  }
</style>

<svelte:head>
  {#if page.query.page != 0}
    <link rel="prev" href={previousURL} />
  {/if}
  <link rel="next" href={nextURL} />
  <link rel="canonical" href={currentURL} />
  <meta property="og:image" content="SITE_URL/icons/title.png" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:image" content="SITE_URL/icons/title.png" />
  {#if categoryData}
    <meta property="og:description" content={categoryData.description} />
    <meta property="description" content={categoryData.description} />
    <meta property="og:title" content="{category} - SITE_DOMAIN" />
    <meta property="og:url" content="BASE_URL/a/{category}" />
    <meta name="twitter:title" content="{category} - SITE_DOMAIN" />
    <meta name="twitter:url" content="BASE_URL/a/{category}" />
  {:else}
    <meta property="og:title" content="SITE_DESCRIPTION - SITE_DOMAIN" />
    <meta property="og:url" content="SITE_URL" />
    <meta property="og:description" content="SITE_DESCRIPTION - SITE_DOMAIN" />
    <meta name="twitter:title" content="SITE_DESCRIPTION - SITE_DOMAIN" />
    <meta name="twitter:url" content="SITE_URL" />
    <meta name="description" content="SITE_DESCRIPTION - SITE_DOMAIN" />
  {/if}
</svelte:head>

{#if category}
  <h4 class="category">
    <a href={`/a/${category}`}>a/{category}</a>
    ·
    <span class="subscriber-count">
      {categoryData.subscriberCount || 0}
      {categoryData.subscriberCount == 1 ? 'Subscriber' : 'Subscribers'}
    </span>
  </h4>
  {#if user}
    {#if user.subscriptions && user.subscriptions.includes(categoryData._id)}
      <button
        href="javascript:void(0)"
        on:click={() => removeSubscription(categoryData._id)}>
        Leave
      </button>
    {:else}
      <button
        href="javascript:void(0)"
        on:click={() => addSubscription(categoryData._id)}>
        Join
      </button>
    {/if}
  {/if}
  <div>{categoryData.description}</div>
  {#if categoryData.owner}
    <div>
      Created by
      <a href={`/u/${categoryData.owner.username}`}>
        {categoryData.owner.username}
      </a>
      {timeSince(categoryData.created)} ago.
    </div>
  {/if}
{:else if pageUser}
  <h4>
    <a href={`/u/${pageUser.username}`}>
      u/{pageUser.username} ({abbreviateNumber(pageUser.karma || 0)})
    </a>
  </h4>
  <div class="bio">
    {#if pageUser.bitcoinAddress}
      <div>
        Bitcoin:
        <a href={`bitcoin:${pageUser.bitcoinAddress}`}>
          {pageUser.bitcoinAddress}
        </a>
      </div>
    {/if}
    {#if pageUser.links.length}
      <div>Links:</div>
      <ul class="links">
        {#each pageUser.links as link}
          <li>
            <a href={link.url} target="_new">{link.name}</a>
          </li>
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
    <a rel="prefetch" href="{page.path}?sort=hot">Hot</a>
    <a rel="prefetch" href="{page.path}?sort=new">New</a>
    <a rel="prefetch" href="{page.path}?sort=top">Top</a>
    <a rel="prefetch" href="{page.path}?sort=comments">Comments</a>
    <a rel="prefetch" href="{page.path}?sort=not">Controversial</a>
    {#if subscriptions && user}
      <a href={`/api/1/posts/rss/${user.id}`}>RSS</a>
    {:else}
      <a
        href={`/api/1/${username ? 'user' : 'posts'}/${category || username ? (category || username) + '/' : ''}rss?sort=${sort}`}>
        RSS
      </a>
    {/if}
  </nav>
{/if}
{#each posts as post}
  {#if !post.category.nsfw || subscriptions || category || pageUser}
    <Post {post} />
  {/if}
{/each}

{#if posts.length > 0 && morePosts}
  <div class="load-more">
    <a
      class="button"
      href={nextURL}
      on:click|preventDefault={fetchPost}>
      Load More
    </a>
  </div>
{/if}
