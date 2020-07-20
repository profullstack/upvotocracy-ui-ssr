<script>
  import { makeApiRequest, globalErrorHandler } from '../../components/create-api'
  import { onMount } from 'svelte'

  let keys = [];
  let hiddenKeys = [];
  let showKey = false;
  let keyName = '';

  $: {
    hiddenKeys = [];
    keys.forEach(key => {
      hiddenKeys.push(`${key.key.slice(0, 5)}${'•'.repeat(key.key.length - 5)}`);
      hiddenKeys = hiddenKeys;
    })
  }

  onMount( async () => {
    const res = await makeApiRequest('/me/apikeys', null, {
      method: 'GET'
    })
      .catch(err => globalErrorHandler(err));
    if (res.keys) {
      keys = res.keys;
    }
  })

  const newApiKey = async () => {
    const res = await makeApiRequest('/me/apikeys', {
      keyName
    },
    {
      method: 'POST'
    })
      .catch(err => globalErrorHandler(err));
    if (res.key) {
      keys.push(res);
      keys = keys;
    }
  }

  const revokeApiKey = async (apiKey) => {
    const url = `/me/apikeys/${apiKey}`
    
    const res = await makeApiRequest(url, null, { 
        method: 'DELETE',
        raw: true
      })
      .catch(err => globalErrorHandler(err));

    const index = keys.findIndex(key => key.key == apiKey);
    keys.splice(index, 1);
    hiddenKeys.splice(index, 1);
    keys = keys;
    hiddenKeys = hiddenKeys;
  }
</script>

<style>
  .keyBox {
    
  }
</style>

<h2>Your API Keys</h2>

{#each keys as key, i}
  <span>{ key.keyName }</span>
  <input class="keyBox" value={ showKey ? key.key : hiddenKeys[i] }>
  <a href="javascript:void(0)" on:click|preventDefault={ revokeApiKey(key.key) }>Revoke</a>
  <br>
{/each}

<button on:click={ () => showKey = !showKey }> { showKey ? 'Hide Keys' : 'Show Keys' } </button>
<br>
<input placeholder="API Key Name" bind:value={keyName}>
<button on:click={ newApiKey }>Generate API key</button>