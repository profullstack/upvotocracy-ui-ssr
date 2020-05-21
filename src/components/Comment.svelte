<script>
  import { createEventDispatcher, onMount } from "svelte";
  import moment from "moment";
  import { userStore } from "../store";
  import { parseContent } from "../utils/parseContent";
  import { makeApiRequest, globalErrorHandler } from "../components/create-api";

  export let id, comments;
  const dispatch = createEventDispatcher();

  let user = {};
  userStore.subscribe(value => {
    if (value) user = value;
  });

  const removeComment = async event => {
    event.preventDefault();
    const {
      srcElement: { id: commentId }
    } = event;

    const url = `/post/${id}/${commentId}`;

    const post = await makeApiRequest(url, null, { method: "DELETE" }).catch(
      err => globalErrorHandler(err)
    );

    if (!post) return;

    dispatch("update-comment", post);
  };

  const voteComment = async (comment, state) => {
    const url = `/post/${id}/${comment.id}/${state}`;

    const data = await makeApiRequest(url, null, { method: "GET" }).catch(err =>
      globalErrorHandler(err)
    );

    if (!data) return;

    for (let i = 0; i < comments.length; i += 1) {
      console.log(comments[i]);
      if (comments[i].id == comment.id) {
        comments[i].score = data.score;
        break;
      }
    }
  };

  let highlighted;

  const highlightComment = async () => {
    const url = window.location.href;
    const split = url.split("#");
    highlighted = split[1];
    if (document.getElementById(highlighted))
      document.getElementById(highlighted).scrollIntoView();
  };

  onMount(() => {
    highlightComment();
    sortComments(sort);
  });

  let sort = "new";

  const sortComments = () => {
    if (sort == "top") {
      comments = comments.sort((a, b) => {
        return b.score - a.score;
      });
    }

    if (sort == "new") {
      comments = comments.sort((a, b) => {
        b.created = new Date(b.created);
        a.created = new Date(a.created);
        return b.created - a.created;
      });
    }

    if (sort == "original") {
      comments = comments.sort((a, b) => {
        b.created = new Date(b.created);
        a.created = new Date(a.created);
        return a.created - b.created;
      });
    }
  };

  $: sortComments(sort);
</script>

<style>
  .content {
    width: 100%;
  }
  .comment-container {
    margin-bottom: 1em;
  }
  .comment-metadata {
    font-size: 12px;
  }
  .comment-body {
    font-size: 14px;
  }
  .comment-highlighted {
    background-color: #d7fded;
  }
  .remove-button {
    cursor: pointer;
  }
  .content .voting-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.3em 0;
    font-size: 14px;
    line-height: 1.5em;
    font-weight: 400;
    text-align: center;
    justify-self: center;
  }
  .content .voting-container .upvote-button,
  .content .voting-container .downvote-button {
    transform: rotate(90deg);
    cursor: pointer;
  }
  .content {
    display: grid;
    grid-template-columns: 4em auto;
  }
  .content .comment-container {
    width: 100%;
  }
  .sort {
    margin-bottom: 0.5em;
  }
</style>

{#if comments.length > 0}
  <div class="sort">
    <a href="javascript:void(0)" on:click={() => (sort = 'top')}>Top</a>
    .
    <a href="javascript:void(0)" on:click={() => (sort = 'new')}>New</a>
    .
    <a href="javascript:void(0)" on:click={() => (sort = 'original')}>
      Original
    </a>
  </div>
{/if}
<div class="content">
  {#each comments as comment}
    <div class="voting-container">
      <span class="upvote-button">
        <span on:click={() => voteComment(comment, 'upvote')}>❮</span>
      </span>
      <span>{comment.score}</span>
      <span class="downvote-button">
        <span on:click={() => voteComment(comment, 'downvote')}>❯</span>
      </span>
    </div>
    <div
      class="comment-container"
      id="comment-id-{comment.id}"
      class:comment-highlighted={highlighted === `comment-id-${comment.id}`}>
      <div class="comment-metadata">
        <a href={`/u/${comment.author.username}`}>{comment.author.username}</a>
        ·
        <span>{moment(comment.created).fromNow()}</span>
        {#if comment.author.id === user.id}
          <span
            id={comment.id}
            class="remove-button float-right"
            on:click={removeComment}>
            Delete
          </span>
        {/if}
      </div>
      <div class="comment-body">
        <span>
          {@html parseContent(comment.body)}
        </span>
      </div>
    </div>
  {/each}
</div>
