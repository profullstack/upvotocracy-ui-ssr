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

{#if post}
  <Post {post} withDetails={true} />
{/if}

<style>
</style>
