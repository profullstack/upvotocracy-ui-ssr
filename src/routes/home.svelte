<script context="module">
  export async function preload(page, session) {
    return { page };
  }
</script>

<script>
  import Home from '../components/Home.svelte'
  import { onMount } from 'svelte'
  import { makeApiRequest, globalErrorHandler } from '../components/create-api'
  
  export let page;
  let morePosts;
  let posts;
  let sort;

  const fetchPage = async () => {
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

    let url = `/subscriptions?sort=${sort}&page=0`;

    const req = await makeApiRequest(url, null, { method: 'GET' })
      .catch(err => globalErrorHandler(err))
    const res = await req.json();
    posts = res.posts;
    morePosts = res.more;

    return { posts, page, morePosts, sort };
  }

  onMount(async () => {
    fetchPage()
  })

  $: fetchPage(page)
</script>

<svelte:head>
 <title>upvotocracy.com</title>
</svelte:head>

<Home posts={posts} page={page} morePosts={morePosts} sort={sort} subscriptions={true}/>