<script>
  import { createEventDispatcher } from 'svelte';
  import { makeApiRequest, globalErrorHandler } from '../../api/create-api';

  export let id;
  let comment = '';
  const dispatch = createEventDispatcher();

  const createComment = async (event) => {
    event.preventDefault();
    const url = `/post/${id}`;

    const post = await makeApiRequest(
      url,
      {
        comment,
      },
      { method: 'POST' },
    ).catch((err) => globalErrorHandler(err));

    if (!post) return;

    dispatch('update-comment', post);
    comment = '';
  };
</script>

<div class="container">
  <textarea bind:value={comment} />
  <div class="lower">
    <button class="btn-lrg" on:click={createComment}> Comment </button>
    <span class="md-ok">Markdown OK</span>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    margin: 0 0 20px 0;
  }
  textarea {
    background: #f6f6f6;
    border: 2px solid var(--green-accent);
    border-radius: 3px;
    height: 60px;
    resize: none;
    font-family: Noto Sans;
    font-size: 15px;
    line-height: 20px;
    padding: 16px;
    color: var(--text-color);
  }
  textarea:focus {
    outline: none;
  }
  button {
    font-weight: bold;
    font-size: 16px;
  }
  .md-ok {
    font-size: 16px;
  }
  .lower {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
  }
  :global([data-theme='dark']) textarea {
    background: #171b19;
  }
  :global([data-theme='dark']) button {
    color: var(--sidebar-bg) !important;
  }
</style>
