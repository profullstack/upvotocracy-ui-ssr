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

    const categoryUrl = 'API_BASE_URL' + `/category/${category}`

    const requests = await Promise.all([ this.fetch(url), this.fetch(categoryUrl) ]);

    const res = await requests[0].json();
    const posts = res.posts;
    const morePosts = res.more;

    const categoryData = await requests[1].json();

    return { category, posts, page, morePosts, categoryData, sort };
  }
</script>
<script>
  import Home from '../../components/Home.svelte'
  export let category;
  export let posts;
  export let page;
  export let morePosts;
  export let categoryData;
  export let sort;
</script>

<svelte:head>
 <title>{category} - {categoryData.description}</title>
  <meta property="og:description" content=`${category} - ${categoryData.description}`>
  <meta property="description" content=`${category} - ${categoryData.description}`>
  <meta property="og:title" content=`${category} - ${categoryData.description}`>
  <meta name="twitter:title" content=`${category} - ${categoryData.description}`>
</svelte:head>

<Home posts={posts} page={page} category={category} morePosts={morePosts} categoryData={categoryData} sort={sort}/>