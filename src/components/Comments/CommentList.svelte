<script>
  import CommentForm from './CommentForm.svelte';
  import SortBar from '../SortBar.svelte';
  import Comment from './Comment.svelte';
  import { stores } from '@sapper/app';

  export let post;
  let comments = post.comments;
  let sort = 'new';
  let page;
  const store = stores();

  store.page.subscribe((val) => (page = val));

  const sortComments = () => {
    if (sort == 'top') {
      comments = comments.sort((a, b) => {
        return b.score - a.score;
      });
    }

    if (sort == 'new') {
      comments = comments.sort((a, b) => {
        b.created = new Date(b.created);
        a.created = new Date(a.created);
        return b.created - a.created;
      });
    }

    if (sort == 'original') {
      comments = comments.sort((a, b) => {
        b.created = new Date(b.created);
        a.created = new Date(a.created);
        return a.created - b.created;
      });
    }
  };

  const updateComment = (event) => {
    comments = event.detail.comments;
    sortComments();
  };

  $: {
    if (typeof page.query.sort == 'undefined') sort = 'new';
    else sort = page.query.sort;
    sortComments();
  }
</script>

<div>
  <CommentForm id={post.id} on:update-comment={updateComment} />
  <SortBar comments={true} />
  {#each comments as comment}
    <Comment {comment} {post} on:update-comment={updateComment} />
  {/each}
</div>

<style>
</style>
