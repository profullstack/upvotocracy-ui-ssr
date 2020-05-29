<script context="module">
  export async function preload(page, session) {
    const { hashtag } = page.params;

    let url = 'API_BASE_URL'
    let headers
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

    if (hashtag) url += `/tags/${hashtag}?sort=${sort}&page=${pageNumber}`


    const req = await this.fetch(url);

    const res = await req.json();
    const posts = res.posts;
    const morePosts = res.more;


    return { hashtag, posts, page, morePosts, sort };
  }
</script>
<script>
  import Home from '../../components/Home.svelte'
  export let hashtag;
  export let posts;
  export let page;
  export let morePosts;
  export let sort;
</script>

<svelte:head>
 <title>#{hashtag} - SITE_DOMAIN</title>
</svelte:head>

<Home posts={posts} page={page} hashtag={hashtag} morePosts={morePosts} sort={sort}/>
