<script>
  import { createEventDispatcher } from 'svelte'

  export let id
  const dispatch = createEventDispatcher()

  const createComment = async (event) => {
    event.preventDefault()
    const form = document.getElementById('comment')
    const formData = new FormData(form)
    form.reset()

    const url = `API_BASE_URL/post/${id}`
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
    const post = await res.json()
    dispatch('update-comment', post)
  }
</script>

<style>
  .content {
    width: 100%;
  }
  .comment-form {
    margin-top: .8em;
  }
  .comment-form .comment-textarea {
    resize: vertical;
    margin-bottom: 0;
  }
</style>

<div class="content">
  <form id="comment" class="comment-form">
    <fieldset>
      <textarea class="comment-textarea" placeholder="Enter your comment" id="comment" name="comment"></textarea>
      <button class="button button-outline float-right" type="submit" on:click={ createComment }>Comment</button>
    </fieldset>
  </form>
</div>
