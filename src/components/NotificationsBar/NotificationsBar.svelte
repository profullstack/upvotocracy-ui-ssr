<script>
  import { showNotificationsBar, showCategoriesBar, userStore } from '../../store';
  import { onMount } from 'svelte';
  import { makeApiRequest, globalErrorHandler } from '../../api/create-api.js';
  import Notification from './Notification.svelte';
  let show;
  let notifications = [];

  showNotificationsBar.subscribe((value) => {
    show = value;
    if (typeof screen !== 'undefined' && screen.width < MOBILE_BREAK_POINT)
      showCategoriesBar.set(false);
  });

  let user;
  userStore.subscribe((value) => (user = value));

  onMount(async () => {
    if (user) {
      const url = '/inbox';
      const res = await makeApiRequest(url, null, { method: 'GET' }).catch((err) =>
        globalErrorHandler(err),
      );
      if (res && res[0]) notifications = res;
    }
  });

  const deleteNotification = async (id) => {
    const url = `/inbox/${id}`;
    const res = await makeApiRequest(url, null, { method: 'DELETE' }).catch((err) =>
      globalErrorHandler(err),
    );

    notifications = notifications.filter((item) => item.id !== id);
  };
</script>

{#if show}
  <div class="sticky-sidebar notifications-bar">
    <h3>Notifications</h3>
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.5 15C11.6421 15 15 11.6421 15 7.5C15 3.35786 11.6421 0 7.5 0C3.35786 0 0 3.35786 0 7.5C0 11.6421 3.35786 15 7.5 15ZM9.57962 3.19127C9.55489 3.12806 9.50944 3.07511 9.45072 3.04107C9.39215 3.00711 9.3238 2.99336 9.25681 3.00316C9.18982 3.01297 9.12811 3.04514 9.08172 3.09447L4.28172 8.19446C4.24153 8.2371 4.21469 8.29057 4.20454 8.34827C4.19439 8.40598 4.20135 8.4654 4.22458 8.51919C4.24781 8.57298 4.28628 8.6188 4.33524 8.65097C4.38421 8.68315 4.44153 8.70029 4.50012 8.70026H6.49392L5.41332 12.2121C5.39332 12.2768 5.39586 12.3465 5.42051 12.4096C5.44517 12.4728 5.49049 12.5257 5.54908 12.5598C5.60768 12.5939 5.6761 12.6072 5.74318 12.5974C5.81027 12.5877 5.87208 12.5555 5.91852 12.5061L10.7185 7.40606C10.7587 7.36343 10.7855 7.30996 10.7957 7.25226C10.8059 7.19455 10.7989 7.13513 10.7757 7.08134C10.7524 7.02755 10.714 6.98173 10.665 6.94956C10.616 6.91738 10.5587 6.90024 10.5001 6.90027H8.50632L9.58692 3.38907C9.60693 3.32421 9.60436 3.25448 9.57962 3.19127Z"
        fill="#666666"
      />
    </svg>
    <div class="notification-list">
      {#each notifications as notification}
        <Notification on:delete={() => deleteNotification(notification.id)} {notification} />
      {/each}
    </div>
  </div>
{/if}

<style>
  h3 {
    font-weight: bold;
    font-size: 19px;
    display: inline-block;
    margin: 10px 0;
  }
  .notifications-bar {
    width: 300px;
  }
  .notification-list {
    display: flex;
    flex-direction: column;
  }
  @media screen and (max-width: MOBILE_BREAK_POINT_PX) {
    .notifications-bar {
      position: fixed;
      right: 0;
    }
  }
</style>
