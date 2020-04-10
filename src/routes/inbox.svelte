<script>
  import { onMount } from 'svelte'
  import { goto } from '@sapper/app'
  import { userStore } from '../store'
  import { slide } from 'svelte/transition'
  import moment from 'moment'
  import { parseContent } from '../utils/parseContent'

  let inbox = []
  let showComment

  let user
  userStore.subscribe(value => {
    user = value
  })

  onMount(async () => {
    if (!user) goto('/')

    const url = 'API_BASE_URL/inbox'
    const token = localStorage.getItem('token')
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    inbox = await res.json()
  })

  const deleteInbox = async (id) => {
    const url = `API_BASE_URL/inbox/${id}`
    const token = localStorage.getItem('token')

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) alert('Something went wrong')

    inbox = inbox.filter(item => item.id !== id)
  }

  const createComment = async (postId) => {
    const form = document.getElementById('comment')
    const formData = new FormData(form)

    const url = `API_BASE_URL/post/${postId}`
    const token = localStorage.getItem('token')

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        comment: formData.get('comment')
      })
    })

    if (!res.ok) alert('Something went wrong!')
    form.reset()
  }

  const showReply = (message) => {
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
          <textarea class="comment-textarea" placeholder="Enter your comment" id="comment" name="comment"></textarea>
          <button class="button button-outline float-right" type="submit" on:click|preventDefault={() => createComment(message.postId) }>Comment</button>
        </fieldset>
      </form>
    {/if}
  </div>
{/each}