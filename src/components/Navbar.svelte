<script>
  import { onMount } from 'svelte'
  import { goto } from '@sapper/app'
  import { userStore, showOverlay, searchResults } from '../store'
  import OverlayMenu from './OverlayMenu.svelte'
  import { abbreviateNumber } from '../utils/abbreviateNumber';
  import { makeApiRequest, globalErrorHandler } from '../components/create-api'

  let inboxCount
  let unread = false
  let q = '';

  let show
  showOverlay.subscribe(value => {
    show = value
  })

  let user
  userStore.subscribe(value => {
    user = value
  })

  const logout = () => {
    localStorage.removeItem('token')
    userStore.update(() => undefined)
  }

  const toggleOverlay = () => {
    showOverlay.set(true)
  }

  const getInboxCount = async (link) => {
    if (user) {
      const url = `/inbox/count`
      const res = await makeApiRequest(url, null, { method: 'GET' })
        .catch(err => globalErrorHandler(err))

      inboxCount = res.count
      if (inboxCount > 0) {
        unread = true
      }
      if (inboxCount > 9) {
        inboxCount = '9+'
      }
      if (inboxCount == 0) {
        unread = false
      }
    }
  }

  async function doSearch(){
    let res = await makeApiRequest('/search/posts?q='+encodeURIComponent(q), null, { method: 'GET' })
      .catch(console.error);

    searchResults.set(res);
    return goto('/search')
  }

  onMount(() => {
    getInboxCount();
    setInterval(() => getInboxCount(), 5000);
  })
</script>

<style>
  .logo {
    height: 3rem;
  }
  .navbar {
    margin-top: 0;
    padding: 1em;
    border-bottom: 2px solid #d1d1d1;
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: white;
  }

  .float-right {
    display: flex;
  }
  .navbar .float-right .navbar-item {
    margin-left: 1.2em;
    display: flex;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
  }
  .unread {
    color: #b70000;
    fill: #b70000 !important;
  }
  .navbar button {
    margin-left: 1.2em;
  }
  #toggle-overlay {
    display: none;
  }
  #mail-icon {
    margin-top: 5px;
    width: 23px;
    fill: #147b50;
  }
  #inbox-count {
    margin-left: .2em;
    padding-bottom: .8em;
    vertical-align: middle;
  }
  @media only screen and (max-width: 850px) {
    .navbar-item {
      display: none !important;
    }
    .float-right {
      display: unset;
    }
    #toggle-overlay {
      display: block;
    }
  }

</style>
{#if show}
  <OverlayMenu {inboxCount}></OverlayMenu>
{/if}
<div class="navbar">
  <span><a href="/"><img class="logo" src="/images/logo.svg" alt="upvotocracy" /></a></span>
  <span><input type="text" bind:value={q}> <button on:click|preventDefault={doSearch}>Search</button></span>
  <div class="float-right">
    {#if user}
      <a href="/compose"><button class="navbar-item">Create a post</button></a>
      <a href="/newcategory"><button class="navbar-item">Create a category</button></a>
      <span class="navbar-item"><a href="/inbox"><svg id="mail-icon" class:unread version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M496,64H16C7.168,64,0,71.168,0,80v352c0,8.832,7.168,16,16,16h480c8.832,0,16-7.168,16-16V80 C512,71.168,504.832,64,496,64z M450.384,96L256,251.504L61.616,96H450.384z M480,416H32V113.28l214,171.2 c2.928,2.352,6.464,3.52,10,3.52s7.072-1.168,10-3.504L480,113.28V416z"/></g></g></svg><span id="inbox-count" class:unread>{inboxCount || ''}</span></a></span>
      <span class="navbar-item"><a href="/u/{ user.username }">{ user.username.toUpperCase() } ({abbreviateNumber(user.karma || 0)})</a></span>
      <span class="navbar-item"><a href="/settings">SETTINGS</a></span>
      <span class="navbar-item"><a href="#" on:click|preventDefault={ logout }>LOGOUT</a></span>
    {:else}
      <span class="navbar-item"><a href="/login">LOGIN</a></span>
      <span class="navbar-item"><a href="/register">REGISTER</a></span>
    {/if}
    <button id="toggle-overlay" on:click={ toggleOverlay }>Menu</button>
  </div>
</div>
