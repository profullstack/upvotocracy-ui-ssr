<Home posts={posts} page={page} />

<svelte:head>
 <title>Search results - upvotocracy.com</title>
</svelte:head>

<script>
  import Home from '../components/Home.svelte'
  import { onMount } from 'svelte'
  import { searchResults } from '../store'
  import { makeApiRequest, globalErrorHandler } from '../components/create-api'
  
  export let page;
  let posts = [];

  searchResults.subscribe(val => {
      console.log(val, 'searchResults');
      posts = val;
  })
</script>
