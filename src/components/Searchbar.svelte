<script>
  import { goto } from '@sapper/app'
  import { searchResults, showOverlay } from '../store'
  import { makeApiRequest, globalErrorHandler } from '../components/create-api'

  let q = '';

  async function doSearch(){
    let res = await makeApiRequest('/search/posts?q='+encodeURIComponent(q), null, { method: 'GET' })
      .catch(console.error);

    if (!res) return

    searchResults.set(res);
    showOverlay.set(false);
    return goto('/search')
  }
</script>
<style>
  form {
    all: unset;
  }
  .search {
    max-width: 200px;
    margin: 0;
  }
  input {
    box-sizing: border-box;
  }
  #search-button {
    margin: 0;
    padding-left: 1.3em;
    padding-right: 1.3em
  }
</style>

<form on:submit|preventDefault={doSearch}>
  <input class="search" type="text" bind:value={q}>
  <button id="search-button">Search</button>
</form>