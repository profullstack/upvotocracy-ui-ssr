<script context="module">
  export async function preload(page) {
    console.log(page);
    const res = await this.fetch(
      'API_BASE_URL/search/posts?q=' + encodeURIComponent(page.query.q),
      null,
      {
        method: 'GET',
      },
    );
    let posts = await res.json();
    if (!res) return;
    return { posts, page };
  }
</script>

<script>
  import PostList from '../components/PostList.svelte';

  export let posts;
  export let page;
</script>

<svelte:head>
  <title>Search results - SITE_DOMAIN</title>
</svelte:head>

{#if posts.length > 0}
  <PostList {posts} />
{:else}
  <h2>No Results for "{page.query.q}"</h2>
{/if}

<style>
</style>
