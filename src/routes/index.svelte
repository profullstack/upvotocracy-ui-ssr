<script context="module">
  export async function preload(page, session) {
    //const { category } = page.params;

    let url = 'API_BASE_URL'
    let headers
    let username
    let sort
    let type
    let pageNumber = 0

    if (page.query.sort) type = page.query.sort
    if (page.query.page) pageNumber = parseInt(page.query.page)

    if (type === 'hot') {
      sort = '-rank'
    } else if (type === 'top') {
      sort = '-score'
    } else if (type === 'new') {
      sort = '-created'
    } else if (type === 'comments') {
      sort = 'comments';
    } else if (type === 'not') {
      sort = '+score';
    }

    url += `/posts/?sort=${sort}&page=${pageNumber}`

    let res = await this.fetch(url);
    res = await res.json();
    const posts = res.posts;
    const morePosts = res.more;

    return { posts, page, morePosts, sort };
  }
</script>
<script>
  import Home from '../components/Home.svelte'
  export let posts;
  export let page;
  export let morePosts;
  export let sort;
</script>

<svelte:head>
  <title>SITE_DOMAIN</title>
</svelte:head>

<Home posts={posts} page={page} morePosts={morePosts} sort={sort}/>
