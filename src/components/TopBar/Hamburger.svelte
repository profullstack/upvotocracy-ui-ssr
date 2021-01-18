<script>
  import { showCategoriesBar } from '../../store';

  let showCategories;
  showCategoriesBar.subscribe((val) => (showCategories = val));
</script>

<div
  on:click={() => showCategoriesBar.set(!showCategories)}
  class="hamburger"
  class:active={showCategories}
>
  <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M27.72 0H0.28C0.126 0 0 0.122727 0 0.272727V2.45455C0 2.60455 0.126 2.72727 0.28 2.72727H27.72C27.874 2.72727 28 2.60455 28 2.45455V0.272727C28 0.122727 27.874 0 27.72 0ZM27.72 21.2727H0.28C0.126 21.2727 0 21.3955 0 21.5455V23.7273C0 23.8773 0.126 24 0.28 24H27.72C27.874 24 28 23.8773 28 23.7273V21.5455C28 21.3955 27.874 21.2727 27.72 21.2727ZM27.72 10.6364H0.28C0.126 10.6364 0 10.7591 0 10.9091V13.0909C0 13.2409 0.126 13.3636 0.28 13.3636H27.72C27.874 13.3636 28 13.2409 28 13.0909V10.9091C28 10.7591 27.874 10.6364 27.72 10.6364Z"
      fill="#111212"
    />
  </svg>
</div>

<style>
  div {
    width: 55px;
    height: 55px;
    border-radius: 3px;
    display: inline-flex;
    background-color: white;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    flex-grow: 0;
  }
  .active {
    background-color: var(--green-accent);
  }
  :global([data-theme='light']) div {
    border: 1px solid #d9d9d9;
  }
  @media screen and (min-width: 750px) {
    .hamburger {
      display: none;
    }
  }
</style>
