<script>
  import { userStore, darkTheme } from '../../store';

  let user;
  userStore.subscribe((value) => {
    user = value;
  });

  let dark;
  darkTheme.subscribe((value) => (dark = value));

  const logout = () => {
    if (localStorage) {
      localStorage.removeItem('token');
      userStore.set(null);
    }
  };
</script>

<nav class="dropdown">
  <a href={`/u/${user.username}`}>Profile</a>
  <a href="/settings">Settings</a>
  <a on:click={logout} href="javascript:void(0)">Logout</a>
  <a on:click={() => darkTheme.set(!dark)} href="javascript:void(0)">
    Switch to {dark ? 'light' : 'dark'} theme
  </a>
</nav>

<style>
  .dropdown {
    position: absolute;
    background-color: #505855;
    z-index: 2;
    top: 64px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 125px;
    text-align: center;
    border-radius: 3px;
    padding: 6px 0;
    border: var(--sidebar-bg) 1px solid;
  }
  .dropdown > a {
    display: block;
    padding: 9px;
  }
  :global([data-theme='light']) .dropdown {
    background-color: #d0d0d0;
  }
</style>
