<script>
  import { userStore, showNotificationsBar } from '../../store';
  import DropdownMenu from './DropdownMenu.svelte';
  import { stores } from '@sapper/app';

  let user;
  let showNotifications;
  let showDropdown = false;
  const store = stores();

  userStore.subscribe((val) => (user = val));
  showNotificationsBar.subscribe((val) => (showNotifications = val));

  store.preloading.subscribe((val) => {
    showDropdown = false;
  });
</script>

<div class="profile-container">
  {#if user}
    <div class="dropdown-container">
      <a on:click|preventDefault={() => (showDropdown = !showDropdown)} href="javascript:void(0)">
        <img class="profile-image" src="/images/profile_image_placeholder.jpg" alt="" />
      </a>
      {#if showDropdown}
        <DropdownMenu />
      {/if}
    </div>
    <div class="name-and-coin">
      <a rel="prefetch" href="/settings" class="username">{user.username}</a>
      <br />
      <svg
        class="coin-icon"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 5.757L5.757 10L10 14.243L14.243 10L10 5.757Z"
          fill="var(--green-accent)"
        />
      </svg>
      <span class="coin-amount">{user.karma}</span>
    </div>
    <svg
      on:click={() => showNotificationsBar.set(!showNotifications)}
      class:rotate={!showNotifications}
      class="arrow"
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 0.292999L5.707 4.586L1.414 0.292999L0 1.707L5.707 7.414L11.414 1.707L10 0.292999Z"
        fill="var(--text-color)"
      />
    </svg>
  {:else}
    <a href="/login">Login</a>
    /
    <a href="/register">Register</a>
  {/if}
</div>

<style>
  .profile-container {
    display: flex;
    align-items: center;
  }
  .coin-amount {
    color: var(--green-accent);
    font-size: 14px;
  }
  .coin-icon {
    vertical-align: sub;
  }
  .name-and-coin {
    width: 136px;
    margin: 0 46px 0 15px;
  }
  .rotate {
    transform: rotate(90deg);
  }
  .arrow {
    cursor: pointer;
  }
  .dropdown-container {
    position: relative;
  }
  @media screen and (max-width: MOBILE_BREAK_POINT_PX) {
    .name-and-coin {
      display: none;
    }
    .arrow {
      margin-left: 13px;
    }
  }
</style>
