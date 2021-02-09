<script>
  import SubscriberCount from '../CategoriesBar/SubscriberCount.svelte';
  import { showMoreInfo } from '../../store';
  import SubscribeButton from '../CategoriesBar/SubscribeButton.svelte';
  import moment from 'moment';

  export let category = null;
  export let user = null;
  let showAddress = false;
  let showOverlay = true;

  showMoreInfo.subscribe((val) => (showOverlay = val));
</script>

{#if showOverlay}
  <div class="more-info sticky-sidebar">
    <div
      style={`background-image: url(${'https://img.currency.com/imgs/articles/1472xx/shutterstock_1239869347.jpg'})`}
      class="banner-img"
    >
      {#if showOverlay}
        <button on:click={() => showMoreInfo.set(false)} class="btn-lrg back-btn">{'<'} back</button
        >
      {/if}
    </div>
    {#if user}
      <img class="profile-image" src="/images/profile_image_placeholder.jpg" alt="profile img" />
    {/if}
    <div class="inner">
      <h2>
        {#if category}
          a/{category.name}
          <SubscribeButton showText={true} />
        {:else if user}
          {user.username}
          {#if user.bitcoinAddress}
            <button on:click={() => (showAddress = !showAddress)} class="btn-lrg">
              bitcoin address
            </button>
          {/if}
        {/if}
      </h2>
      {#if showAddress && user.bitcoinAddress}
        <code>{user.bitcoinAddress}</code>
      {/if}
      {#if category}
        <p class="description">
          {category.description}
        </p>
      {:else if user}
        {#if user.created}
          <p class="member-since">Member since: {moment(user.created).fromNow()}</p>
        {/if}
        <h3>Links</h3>
        {#each user.links as link}
          <a href={link.url} target="_blank">- {link.name}</a>
        {/each}
      {/if}
      {#if category}
        <span class="sub-count">
          <SubscriberCount count={category.subscriberCount} />
        </span>
      {/if}
    </div>
  </div>
{/if}

<style>
  .member-since {
    margin: 5px 0;
  }
  .more-info {
    width: 339px;
    padding: 0;
    background-color: var(--bg);
  }
  .banner-img {
    height: 200px;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .inner {
    margin: 18px;
  }
  .profile-image {
    position: static;
    margin-left: 19px;
    margin-top: -43px;
  }
  .btn-lrg {
    font-size: 13px;
    padding: 3px 10px;
    float: right;
  }
  .back-btn {
    float: left;
    margin: 20px;
    display: none;
  }
  .sub-count {
    display: block;
    margin: 20px 0;
  }
  a {
    display: block;
  }
  :global([data-theme='dark']) .more-info {
    background-color: #171818;
  }
  @media screen and (max-width: MOBILE_BREAK_POINT_PX) {
    .more-info {
      width: 100%;
      position: fixed;
    }
    .back-btn {
      display: inline-block;
    }
  }
</style>
