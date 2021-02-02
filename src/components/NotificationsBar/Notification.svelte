<script>
  import moment from 'moment';
  export let notification;
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
  }
  .time {
    font-size: 12px;
  }
  .profile-image {
    margin-right: 15px;
  }
</style>
