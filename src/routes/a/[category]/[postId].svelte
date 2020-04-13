<script context="module">
  export async function preload(page, session) {
    let post
    const { postId, category } = page.params
    const url = `API_BASE_URL/post/${postId}`

    const res = await this.fetch(url)
    if (!res.ok) return alert('Something wrong!')
    post = await res.json()
    return { post, category }
  }
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta property="og:description" content={post.text || post.title}>
  <meta property="description" content={post.text || post.title}>
  <meta property="og:title" content="{post.title}">
  <meta property="og:url" content="BASE_URL/a/{post.category.name}/{post.id}">
  <meta name="twitter:title" content="{post.title}">
  <meta name="twitter:url" content="BASE_URL/a/{post.category.name}/{post.id}">
  {#if post.thumb}
    <meta property="og:image" content="{post.thumb}">
    <meta property="twitter:image" content="{post.thumb}">
    <meta name="twitter:card" content="summary_large_image">
  {/if}
</svelte:head>

<script>
  import Post from '../../../components/Post.svelte'
  import Comment from '../../../components/Comment.svelte'
  import CommentForm from '../../../components/CommentForm.svelte'
  import { userStore } from '../../../store'

  export let category = null
  export let post = null

  let user
  userStore.subscribe(value => {
    user = value
  })

  const updateComment = (event) => {
    post = event.detail
  }
</script>

<style>
  .post-body {
    grid-column-start: span 2;
  }

  .post-meta {
    grid-column: 2;
  }
</style>

{#if post}
  {#if category}
  <h4><a href={`/a/${category}`}>a/{category}</a></h4>
  {/if}
<div class="post-body">
  <Post { post } withDetails={ true }></Post>
</div>
<div class="post-meta">
  {#if user}
    <CommentForm id={ post.id } on:update-comment={ updateComment }></CommentForm>
  {/if}
  <Comment id={ post.id } comments={ post.comments } on:update-comment={ updateComment }></Comment>
</div>
{/if}
