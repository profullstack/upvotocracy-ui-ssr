<script>
  import SubscriberCount from '../CategoriesBar/SubscriberCount.svelte';
  import { showMoreInfo, userStore } from '../../store';
  import SubscribeButton from '../CategoriesBar/SubscribeButton.svelte';
  import moment from 'moment';
  import { makeApiRequest, globalErrorHandler } from '../../api/create-api.js';
  import { goto } from '$app/navigation';
  import { getCategoriesAndSave } from '../../api/categories';

  export let category = null;
  export let user = null;
  let showAddress = false;
  let showOverlay = true;

  showMoreInfo.subscribe((val) => (showOverlay = val));

  let currentUser;
  userStore.subscribe((val) => (currentUser = val));

  const deleteCategory = async () => {
    const res = await makeApiRequest(`/category/${category._id}`, null, {
      method: 'DELETE',
    }).catch((err) => globalErrorHandler(err));
    if (res.status == 'deleted') {
      getCategoriesAndSave();
      return await goto('/');
    }
  };

  const deleteUser = async () => {
    const res = await makeApiRequest(`/user/${user.id}`, null, {
      method: 'DELETE',
    }).catch((err) => globalErrorHandler(err));
    if (res.status == 'deleted') {
      return await goto('/');
    }
  };
</script>

{#if showOverlay}
  <div class="more-info sticky-sidebar">
    <div
      style={`background-image: url(${
        category && category.image
          ? category.image
          : 'https://img.currency.com/imgs/articles/1472xx/shutterstock_1239869347.jpg'
      })`}
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
          <SubscribeButton categoryID={category._id} showText={true} />
        {:else if user}
          {user.username}
          {#if user.bitcoinAddress || user.nimiqAddress || user.ethereumAddress}
            <button on:click={() => (showAddress = !showAddress)} class="btn-lrg">
              payment addresses
            </button>
          {/if}
        {/if}
      </h2>
      {#if showAddress && user.bitcoinAddress}
        <div>Bitcoin:</div>
        <code>{user.bitcoinAddress}</code>
      {/if}
      {#if showAddress && user.nimiqAddress}
        <div>Nimiq:</div>
        <code>{user.nimiqAddress}</code>
      {/if}
      {#if showAddress && user.ethereumAddress}
        <div>Ethereum:</div>
        <code>{user.ethereumAddress}</code>
      {/if}
      {#if category}
        <p class="description">
          {category.description}
        </p>
        <br />
        <p class="description">
          Created by: <a class="edit-link" rel="prefetch" href={`/u/${category.owner.username}`}
            >{category.owner.username}</a
          >
        </p>
        <span class="sub-count">
          <SubscriberCount count={category.subscriberCount} />
        </span>
        {#if category.owner.id == currentUser.id || currentUser.admin}
          <a class="edit-link" href={`/a/${category.name}/edit`}>Edit</a>
          <a on:click={deleteCategory} class="edit-link" href="javascript:void(0)">Delete</a>
        {/if}
      {:else if user}
        {#if user.created}
          <p class="member-since">Member since: {moment(user.created).fromNow()}</p>
        {/if}
        <h3>Links</h3>
        {#each user.links as link}
          <a href={link.url} target="_blank">- {link.name}</a>
        {/each}
        {#if currentUser.admin}
          <a on:click={deleteUser} class="edit-link" href="javascript:void(0)">Delete</a>
        {/if}
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
  .edit-link {
    font-weight: bold;
    color: var(--green-accent);
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
