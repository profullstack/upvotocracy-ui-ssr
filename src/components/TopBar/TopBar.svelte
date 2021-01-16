<script>
  import Logo from './Logo.svelte';
  import SearchBar from '../SearchBar.svelte';
  import ComposeButton from './ComposeButton.svelte';
  import ProfileInfo from './ProfileInfo.svelte';
  import Hamburger from './Hamburger.svelte';
</script>

<div class="top-bar">
  <div class="left">
    <span class="logo"><Logo /></span>
    <Hamburger />
    <ComposeButton />
    <SearchBar />
  </div>
  <div class="right">
    <ProfileInfo />
  </div>
</div>

<style>
  .top-bar {
    background-color: var(--top-bar-bg);
    display: flex;
    padding: 17px;
    justify-content: space-between;
    position: sticky;
    top: 0;
  }
  .left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 200px;
  }
  .left > * {
    margin-left: 5px;
    margin-right: 5px;
  }
  :global([data-theme='light']) .top-bar {
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.08);
  }
  @media screen and (max-width: 750px) {
    .logo {
      display: none;
    }
  }
</style>
