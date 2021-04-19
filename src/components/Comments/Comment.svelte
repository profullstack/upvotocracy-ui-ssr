<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import moment from 'moment';
  import { userStore } from '../../store';
  import { parseContent } from '../../utils/parseContent';
  import { makeApiRequest, globalErrorHandler } from '../../api/create-api';
  import VoteArrow from '../VoteArrow.svelte';

  export let comment;
  export let post;
  let userVote;

  let user = {};
  userStore.subscribe((value) => {
    if (value) user = value;
  });

  const removeComment = async (event) => {
    event.preventDefault();
    const {
      srcElement: { id: commentId },
    } = event;

    const url = `/post/${post.id}/${commentId}`;

    const post = await makeApiRequest(url, null, { method: 'DELETE' }).catch((err) =>
      globalErrorHandler(err),
    );

    if (!post) return;

    dispatch('update-comment', post);
  };

  const voteComment = async (state) => {
    const url = `/post/${post.id}/${comment.id}/${state}`;

    const data = await makeApiRequest(url, null, { method: 'GET' }).catch((err) =>
      globalErrorHandler(err),
    );

    if (!data) return;

    comment.score = data.score;
    userVote = state;
  };

  const getUserVote = () => {
    const vote = comment.votes.filter((vote) => vote.user == user.id);

    if (vote[0]) {
      if (vote[0].vote == -1) userVote = 'downvote';
      else if (vote[0].vote == 1) userVote = 'upvote';
    }
  };

  onMount(() => {
    getUserVote();
  });
</script>

<div class="comment">
  <div class="score">
    <VoteArrow type="up" click={() => voteComment('upvote')} selected={userVote == 'upvote'} />
    {comment.score}
    <VoteArrow
      type="down"
      click={() => voteComment('downvote')}
      selected={userVote == 'downvote'}
    />
  </div>
  <img class="profile-image" src="/images/profile_image_placeholder.jpg" alt="profile" />
  <div class="right">
    <a href={`/u/${comment.author.username}`} class="username">{comment.author.username}</a>
    <span class="time">{moment(comment.created).fromNow()}</span>
    <div class="comment-body">
      {@html parseContent(comment.body)}
    </div>
  </div>
</div>

<style>
  .comment {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin: 25px 0;
  }
  .right {
    margin-left: 15px;
    flex-grow: 1;
    max-width: 87%;
  }
  .score {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30px;
    height: 51px;
    justify-content: space-between;
    font-weight: bold;
    font-size: 15px;
    flex-shrink: 0;
  }
  .username {
    font-weight: bold;
    font-size: 15px;
    color: var(--green-accent);
  }
  .profile-image {
    max-width: 55px;
    max-height: 55px;
    border-radius: 3px;
  }
  .time {
    font-size: 15px;
  }

  .comment-body {
    font-size: 15px;
  }

  :global(.comment-body a) {
    text-decoration: underline;
    color: var(--green-accent);
  }
</style>
