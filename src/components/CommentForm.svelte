<script>
  import { createEventDispatcher } from 'svelte'
  import { makeApiRequest, globalErrorHandler } from '../components/create-api'

  export let id
  const dispatch = createEventDispatcher()

  const createComment = async (event) => {
    event.preventDefault()
    const form = document.getElementById('comment')
    const formData = new FormData(form)
    form.reset()

    const url = `/post/${id}`

    const post = await makeApiRequest(url, {
      comment: formData.get('comment')
    },
    { method: 'POST'})
      .catch(err => globalErrorHandler(err))

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
      Markdown OK <button class="button button-outline float-right" type="submit" on:click={ createComment }>Comment</button>
    </fieldset>
  </form>
</div>
