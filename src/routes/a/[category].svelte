<script context="module">
  export async function preload(page, session) {
    const { category } = page.params;

    let url = 'API_BASE_URL'
    let headers
    let sort
    let type

    if (page.query.sort) type = page.query.sort 

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

    if (category) url += `/posts/${category}?sort=${sort}&page=0`

    let res = await this.fetch(url);
    res = await res.json();
    const posts = res.posts;
    const morePosts = res.more;

    return { category, posts, page, morePosts };
  }
</script>
<script>
  import Home from '../../components/Home.svelte'
  export let category;
  export let posts;
  export let page;
  export let morePosts;
</script>

<svelte:head>
 <title>{category} - upvotocracy.com</title>
</svelte:head>

<Home posts={posts} page={page} category={category} morePosts={morePosts}/>