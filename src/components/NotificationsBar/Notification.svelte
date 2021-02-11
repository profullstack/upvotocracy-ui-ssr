<script>
  import moment from 'moment';
  import { createEventDispatcher } from 'svelte';
  export let notification;

  const dispatch = createEventDispatcher();

  if (notification.body.length > 40) {
    notification.body = notification.body.slice(0, 37) + '...';
  }
</script>

<div class="notification-container">
  <img class="profile-image" src="/images/profile_image_placeholder.jpg" alt="" />
  <div class="right">
    <div class="top">
      <a href={`/u/${notification.author}`} class="author">{notification.author}</a>
      <span class="action-description">commented on a post</span>
    </div>
    <a rel="prefetch" href={notification.link} class="body">
      {notification.body}
    </a>
    <span class="time">{moment(notification.created).fromNow()}</span>
    <a class="delete" href="javascript:void(0);" on:click={() => dispatch('delete')}>delete</a>
  </div>
</div>

<style>
  .notification-container {
    display: flex;
    height: 80px;
    justify-content: flex-start;
    align-items: center;
  }
  .top {
    font-size: 15px;
  }
  .author {
    color: var(--green-accent);
    font-weight: bold;
  }
  .body {
    display: block;
    font-size: 12px;
    max-height: 20px;
    overflow-x: hidden;
  }
  .time {
    font-size: 12px;
  }
  .profile-image {
    margin-right: 15px;
  }
  .delete {
    float: right;
    font-size: 13px;
  }
</style>
