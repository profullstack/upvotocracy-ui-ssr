<script>
  import SubscribeButton from './SubscribeButton.svelte';

  export let category;
</script>

<div class="category">
  <span class="count">
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.75 2.84211C2.75 4.40905 3.98383 5.68421 5.5 5.68421C7.01617 5.68421 8.25 4.40905 8.25 2.84211C8.25 1.27516 7.01617 0 5.5 0C3.98383 0 2.75 1.27516 2.75 2.84211ZM10.3889 12H11V11.3684C11 8.93116 9.0805 6.94737 6.72222 6.94737H4.27778C1.91889 6.94737 0 8.93116 0 11.3684V12H10.3889Z"
        fill="#666666"
      />
    </svg>
    {category.subscriberCount}
  </span>
  <a class="name" rel="prefetch" href="/a/{category.name}">
    {category.name}
    {#if category.nsfw}
      <span class="nsfw">(nsfw)</span>
    {/if}
  </a>
  <SubscribeButton categoryID={category._id} />
</div>

<style>
  .category {
    padding: 10px 0 10px 0;
  }
  .count {
    background-color: var(--search-bar-bg);
    border-radius: 3px;
    padding: 3px 10px;
    font-weight: bold;
    font-size: 13px;
    border: 1px solid #ffffff00;
  }
  .name {
    margin-left: 15px;
    overflow: hidden;
    display: inline-block;
    max-width: 210px;
  }
  .nsfw {
    color: red;
  }
  :global([data-theme='dark']) .count {
    color: #666666;
  }
  :global([data-theme='light']) .count {
    border: 1px solid #dfdfdf;
    box-sizing: border-box;
  }
  :global([data-theme='light']) .count svg path {
    fill: var(--text-color);
  }
</style>
