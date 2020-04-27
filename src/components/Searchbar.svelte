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
  .search {
    max-width: 200px;
    margin: 0;
  }
  #search-button {
    margin-left: 0;
    padding-left: 1.3em;
    padding-right: 1.3em
  }
</style>

<input class="search" type="text" bind:value={q}>
<button id="search-button" on:click|preventDefault={doSearch}>Search</button>