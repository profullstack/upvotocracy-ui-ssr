<script>
  import SubscribeButton from './SubscribeButton.svelte';
  import SubscriberCount from './SubscriberCount.svelte';

  export let category;
  export let selected;
</script>

<div class:selected class="category">
  <span class="left">
    <SubscriberCount {selected} count={category.subscriberCount} />
    <a class:selected class="name" rel="prefetch" href="/a/{category.name}">
      {category.name}
      {#if category.nsfw}
        <span class="nsfw">(nsfw)</span>
      {/if}
    </a>
  </span>
  <SubscribeButton categoryID={category._id} />
</div>

<style>
  .category {
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .left {
    display: flex;
    align-items: center;
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
  .category.selected {
    background: rgba(18, 245, 149, 0.08);
    outline: 1px solid rgba(18, 245, 149, 0.4);
  }
  .name.selected {
    color: #12f595;
    font-weight: bold;
  }
  :global([data-theme='light']) .category.selected {
    background: rgba(20, 123, 80, 0.08);
    outline: 1px solid rgba(20, 123, 80, 0.4);
  }
  :global([data-theme='light']) .name.selected {
    color: #147b50;
    font-weight: bold;
  }
</style>
