<script>
  import Post from './Post.svelte';
  import { onMount, getContext } from 'svelte';
  import { userStore, currentCategory } from '../store';
  import { abbreviateNumber } from '../utils/abbreviateNumber';
  import { timeSince } from '../utils/time';
  //import { addSubscription, removeSubscription } from '..//editSubscriptions';
  import { makeApiRequest, globalErrorHandler } from '../api/create-api';
  import SortBar from './SortBar.svelte';
  import MoreInfoSmall from './MoreInfoBar/MoreInfoSmall.svelte';
  import Footer from './Footer.svelte';

  export let username = null;
  export let category = null;
  export let hashtag = null;
  export let subscriptions = null;
  export let searchResults = null;
  export let posts = [];
  export let page;
  export let morePosts = false;
  export let sort = '-created';
  export let categoryData;
  export let pageUser;
  let previousURL;
  let nextURL;
  let currentURL;

  let currentCat;
  currentCategory.subscribe((value) => {
    currentCat = value;
  });

  let user;

  userStore.subscribe((value) => {
    if (value) {
      user = value;
    }
  });

  onMount(() => {
    const rss = document.querySelector('link[type="application/rss+xml"]');

    if (category) {
      rss.setAttribute('href', `SITE_URL/api/1/posts/${category}/rss?sort=-created`);
      rss.setAttribute('title', `SITE_NAME ${category} RSS Feed`);
      currentCategory.set(category);
    } else {
      rss.setAttribute('href', `SITE_URL/api/1/posts/rss?sort=-created`);
      rss.setAttribute('title', `SITE_NAME RSS Feed`);
    }
  });

  const fetchPost = async () => {
    let pageNumber;
    let currentURL = new URLSearchParams(window.location.search);

    if (currentURL.get('page')) pageNumber = parseInt(currentURL.get('page')) + 1;
    else pageNumber = 1;

    updateUrl(pageNumber);

    let url = '';
    let noauth = true;

    if (username) url += `/user/${username}?sort=${sort}&page=${pageNumber}`;
    else if (category) url += `/posts/${category}?sort=${sort}&page=${pageNumber}`;
    else if (subscriptions) {
      noauth = false;
      url += `/subscriptions?sort=${sort}&page=${pageNumber}`;
    } else if (hashtag) {
      url += `/tags/${hashtag}?sort=${sort}&page=${pageNumber}`;
    } else url += `/posts?sort=${sort}&page=${pageNumber}`;

    let res = await makeApiRequest(url, null, { method: 'GET', noauth }).catch((err) =>
      globalErrorHandler(err),
    );

    if (!res) return;

    morePosts = res.more;
    posts = posts.concat(res.posts);
  };

  const updateUrl = (pageNumber) => {
    const currentURL = new URL(window.location.href);
    const searchParams = currentURL.searchParams;
    searchParams.set('page', pageNumber);
    currentURL.search = searchParams.toString();

    history.pushState({}, '', currentURL);
  };

  const getNextUrl = () => {
    if (typeof page == 'undefined') return;
    if (typeof page.query == 'undefined') return;

    if (page.query.page) page.query.page = parseInt(page.query.page);
    else page.query.page = 0;

    let queries = '';
    Object.keys(page.query).forEach((key, i) => {
      queries += `${key}=${page.query[key]}${i != Object.keys(page.query).length - 1 ? '&' : ''}`;
    });

    const url = new URL(`${'BASE_URL'}${page.path}?${queries}`);
    currentURL = url.href;

    url.searchParams.set('page', parseInt(page.query.page) - 1);
    previousURL = url.href;

    url.searchParams.set('page', parseInt(page.query.page) + 1);
    nextURL = url.href;
  };
  getNextUrl();
</script>

<div class="center">
  <div class="container">
    <MoreInfoSmall category={categoryData} user={pageUser} />
    <div class="padding">
      <SortBar {page} {username} {hashtag} {category} {user} {subscriptions} {sort} />
    </div>
    {#each posts as post}
      <Post {post} />
    {/each}
    {#if posts.length > 0 && morePosts}
      <div class="btn-container">
        <a class="btn-lrg" href={nextURL} on:click|preventDefault={fetchPost}> Load More </a>
      </div>
    {/if}
    <Footer />
  </div>
</div>

<style>
  .center {
    display: flex;
    flex-grow: 1;
    justify-content: center;
  }
  .container {
    max-width: 750px;
    flex-grow: 1;
  }
  .btn-container {
    display: flex;
    justify-content: center;
    margin: 10px;
  }
  .padding {
    padding: 0 15px;
  }
</style>
