<script>
  import SubscribeButton from './SubscribeButton.svelte';
  import SubscriberCount from './SubscriberCount.svelte';

  export let category;
</script>

<div class="category">
  <SubscriberCount count={category.subscriberCount} />
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
  .name {
    margin-left: 15px;
    overflow: hidden;
    display: inline-block;
    max-width: 210px;
  }
  .nsfw {
    color: red;
  }
</style>
