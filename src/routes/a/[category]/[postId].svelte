<script context="module">
  export async function preload(page, session) {
    let post;
    const { postId, category } = page.params;
    const url = `API_BASE_URL/post/${postId}`;

    const res = await this.fetch(url);
    if (!res.ok) return alert('Something wrong!');
    post = await res.json();
    return { post, category };
  }
</script>

<script>
  import Post from '../../../components/Post.svelte';
  import { userStore } from '../../../store';

  export let category = null;
  export let post = null;

  let user;
  userStore.subscribe((value) => {
    user = value;
  });

  const updateComment = (event) => {
    post = event.detail;
  };
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta property="og:description" content={post.text || post.title} />
  <meta property="description" content={post.text || post.title} />
  <meta property="og:title" content={post.title} />
  <meta property="og:url" content="BASE_URL/a/{post.category.name}/{post.id}" />
  <meta name="twitter:title" content={post.title} />
  <meta name="twitter:url" content="BASE_URL/a/{post.category.name}/{post.id}" />
  {#if post.thumb}
    <meta property="og:image" content={post.thumb} />
    <meta property="twitter:image" content={post.thumb} />
    <meta name="twitter:card" content="summary_large_image" />
  {/if}
</svelte:head>

{#if post}
  <Post {post} withDetails={true} />
{/if}

<style>
</style>
