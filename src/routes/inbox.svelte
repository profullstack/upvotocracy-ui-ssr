<script>
  import { onMount } from 'svelte'
  import { goto } from '@sapper/app'
  import { userStore } from '../store'
  import { slide } from 'svelte/transition'
  import moment from 'moment'
  import { parseContent } from '../utils/parseContent'
  import { makeApiRequest, globalErrorHandler } from '../components/create-api'

  let inbox = []
  let showComment
  let quote;

  let user
  userStore.subscribe(value => {
    user = value
  })

  onMount(async () => {
    if (!user) goto('/')

    const url = '/inbox'
    inbox = await makeApiRequest(url, null, { method: 'GET' })
      .catch(err => globalErrorHandler(err))
  })

  const deleteInbox = async (id) => {
    const url = `/inbox/${id}`
    const res = await makeApiRequest(url, null, { method: 'DELETE' })
      .catch(err => globalErrorHandler(err))

    inbox = inbox.filter(item => item.id !== id)
  }

  const createComment = async (postId) => {
    const form = document.getElementById('comment')
    const formData = new FormData(form)

    const url = `/post/${postId}`
    const res = await makeApiRequest(url, { comment: formData.get('comment') }, { method: 'POST' })
      .catch(err => globalErrorHandler(err))

    if (!res) return
    form.reset()
  }

  const showReply = (message) => {
    quote = typeof window !== 'undefined' && window.getSelection().toString();
    showComment === message.id ? showComment = '' : showComment = message.id
  }
</script>

<style>
  .post-container {
    margin-top: 1em;
  }
</style>

<svelte:head>
  <title>Inbox - upvotocracy.com</title>
</svelte:head>

<h1>Inbox</h1>

{#each inbox as message}
  <div class="post-container">
    <div class="post-title">
      <a href="{ message.link }"> Comment on: { message.title }</a>
    </div>

    <div class="post-preview">
      {@html parseContent(message.body)}
    </div>

    <div class="post-detail">
      <a href="/a/{ message.category }">/a/{ message.category }</a> ·
      <span>from</span>
      <a href="/u/{ message.author }">{ message.author }</a> ·
      <span>{ moment(message.created).fromNow() }</span> ·
      <a href="javascript:void(0);" on:click={() => showReply(message) }>Reply</a> ·
      <a href="javascript:void(0);" on:click={() => deleteInbox(message.id)}>Delete</a>
    </div>

    {#if showComment === message.id}
      <form id="comment" class="comment-form" transition:slide="{{ duration: 400 }}">
        <fieldset>
        {#if quote}
          <textarea class="comment-textarea" placeholder="Enter your comment" id="comment" name="comment">> {quote}</textarea>
        {:else}
          <textarea class="comment-textarea" placeholder="Enter your comment" id="comment" name="comment"></textarea>
        {/if}
          <button class="button button-outline float-right" type="submit" on:click|preventDefault={() => createComment(message.postId) }>Comment</button>
        </fieldset>
      </form>
    {/if}
  </div>
{/each}