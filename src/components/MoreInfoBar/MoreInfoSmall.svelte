<script>
  import SubscriberCount from '../CategoriesBar/SubscriberCount.svelte';
  import { showMoreInfo } from '../../store';
  import SubscribeButton from '../CategoriesBar/SubscribeButton.svelte';

  export let category = null;
  export let user = null;
</script>

{#if category || user}
  <div class="info-container">
    <div class="top">
      <div class="left">
        <h2>
          {#if category}
            a/{category.name}
          {:else if user}
            u/{user.username}
          {/if}
        </h2>
        {#if category}
          <SubscriberCount count={category.subscriberCount} />
        {/if}
        <button on:click={() => showMoreInfo.set(true)} class="btn-lrg more-info">MORE INFO</button>
      </div>
      {#if category}
        <SubscribeButton categoryID={category._id} showText={true} />
      {/if}
    </div>
    {#if category}
      <p class="description">
        {category.description}
      </p>
    {/if}
  </div>
{/if}

<style>
  .info-container {
    padding: 20px 5px;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .left {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .left > * {
    margin: 0 8px;
  }
  .description {
    margin-top: 10px;
  }
  h2 {
    display: inline;
  }
  .more-info {
    font-size: 13px;
    padding: 3px 10px;
  }

  @media screen and (min-width: MOBILE_BREAK_POINT_PX) {
    .info-container {
      display: none;
    }
  }
</style>
