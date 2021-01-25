<script context="module">
  export async function preload(page, session) {
    const { username } = page.params;

    let url = 'API_BASE_URL';
    let headers;
    let sort;
    let type;
    let pageNumber = 0;

    if (page.query.sort) type = page.query.sort;
    if (page.query.page) pageNumber = parseInt(page.query.page);

    if (type === 'hot') {
      sort = '-rank';
    } else if (type === 'top') {
      sort = '-score';
    } else if (type === 'new') {
      sort = '-created';
    } else if (type === 'comments') {
      sort = 'comments';
    } else if (type === 'not') {
      sort = '+score';
    }

    if (username) url += `/user/${username}?sort=${sort}&page=${pageNumber}`;

    const pageUserUrl = 'API_BASE_URL' + `/users/${username}`;

    const requests = await Promise.all([this.fetch(url), this.fetch(pageUserUrl)]);

    const res = await requests[0].json();
    const posts = res.posts;
    const morePosts = res.more;

    const pageUser = await requests[1].json();

    return { posts, page, morePosts, username, pageUser };
  }
</script>

<script>
  import PostList from '../../components/PostList.svelte';
  export let posts;
  export let page;
  export let morePosts;
  export let username;
  export let pageUser;
</script>

<svelte:head>
  <title>SITE_DOMAIN</title>
</svelte:head>

<PostList {posts} {page} {morePosts} {username} {pageUser} />
