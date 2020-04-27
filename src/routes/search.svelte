<script context="module">
  export async function preload(page, session) {
    return { page };
  }
</script>

<h3>Search Results:</h3>

<Home posts={posts} page={page} searchResults={true}/>

<svelte:head>
 <title>Search results - upvotocracy.com</title>
</svelte:head>

<script>
  import Home from '../components/Home.svelte'
  import { onMount } from 'svelte'
  import { searchResults } from '../store'
  
  export let page;
  let posts = [];

  searchResults.subscribe(val => {
    posts = val;
  })
</script>
