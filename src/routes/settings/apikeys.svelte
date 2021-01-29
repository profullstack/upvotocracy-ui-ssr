<script>
  import { makeApiRequest, globalErrorHandler } from '../../api/create-api';
  import { onMount } from 'svelte';
  import copyToClipboard from '../../utils/clipboard';

  let keys = [];
  let hiddenKeys = [];
  let showKey = false;
  let keyName = '';

  $: {
    hiddenKeys = [];
    keys.forEach((key) => {
      hiddenKeys.push(`${key.key.slice(0, 5)}${'•'.repeat(key.key.length - 5)}`);
      hiddenKeys = hiddenKeys;
    });
  }

  onMount(async () => {
    const res = await makeApiRequest('/me/apikeys', null, {
      method: 'GET',
    }).catch((err) => globalErrorHandler(err));
    if (res.keys) {
      keys = res.keys;
    }
  });

  const newApiKey = async () => {
    const res = await makeApiRequest(
      '/me/apikeys',
      {
        keyName,
      },
      {
        method: 'POST',
      },
    ).catch((err) => globalErrorHandler(err));
    if (res.key) {
      keys.push(res);
      keys = keys;
      keyName = '';
    }
  };

  const revokeApiKey = async (apiKey) => {
    const url = `/me/apikeys/${apiKey}`;

    const res = await makeApiRequest(url, null, {
      method: 'DELETE',
      raw: true,
    }).catch((err) => globalErrorHandler(err));

    const index = keys.findIndex((key) => key.key == apiKey);
    keys.splice(index, 1);
    hiddenKeys.splice(index, 1);
    keys = keys;
    hiddenKeys = hiddenKeys;
  };
</script>

<svelte:head>
  <title>Settings - API Keys</title>
</svelte:head>

<div class="container">
  <h3 class="title">Your API Keys</h3>

  <p>
    Include the header: <code>Authorization: Api-Key [yourapikey]</code> with your API request
  </p>

  {#each keys as key, i}
    <div class="key">
      <label for="key">{key.keyName}</label>
      <div class="input-container">
        <div class="input copy-input">
          <input readonly="readonly" name="key" value={showKey ? key.key : hiddenKeys[i]} />
          <svg
            on:click={() => copyToClipboard(key.key)}
            class="copy-btn"
            width="18"
            height="21"
            viewBox="0 0 18 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1053 19.0909H5.68421V5.72727H16.1053V19.0909ZM16.1053 3.81818H5.68421C5.18169 3.81818 4.69976 4.01932 4.34443 4.37734C3.9891 4.73537 3.78947 5.22095 3.78947 5.72727V19.0909C3.78947 19.5972 3.9891 20.0828 4.34443 20.4408C4.69976 20.7989 5.18169 21 5.68421 21H16.1053C16.6078 21 17.0897 20.7989 17.445 20.4408C17.8004 20.0828 18 19.5972 18 19.0909V5.72727C18 5.22095 17.8004 4.73537 17.445 4.37734C17.0897 4.01932 16.6078 3.81818 16.1053 3.81818ZM13.2632 0H1.89474C1.39222 0 0.910288 0.201136 0.554955 0.55916C0.199623 0.917184 0 1.40277 0 1.90909V15.2727H1.89474V1.90909H13.2632V0Z"
              fill="var(--text-color)"
            />
          </svg>
        </div>
        <button class="btn-lrg revoke-btn" on:click|preventDefault={revokeApiKey(key.key)}
          >Revoke</button
        >
      </div>
    </div>
  {/each}

  <button class="btn-lrg show-btn" on:click={() => (showKey = !showKey)}>
    {showKey ? 'Hide Keys' : 'Show Keys'}
  </button>
  <label for="">API Key Name</label>
  <div class="input-container">
    <input class="input" placeholder="API Key Name" bind:value={keyName} />
    <button class="btn-lrg generate-btn" on:click={newApiKey}>Generate API key</button>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 450px;
    padding: 10px;
  }
  .show-btn {
    margin: 20px 0;
    width: 95px;
    padding: 0;
    height: 25px;
    font-size: 13px;
  }
  .generate-btn {
    font-size: 16px;
  }
  .input-container {
    display: flex;
  }
  .input-container input {
    box-sizing: border-box;
    margin-right: 15px;
    width: 50%;
    flex-grow: 2;
  }
  .revoke-btn {
    background-color: #1b1f1e;
  }
  .copy-input {
    display: flex;
    justify-content: space-between;
    width: 70%;
    margin-right: 15px;
  }
  .copy-input input {
    flex-grow: 2;
  }
  .copy-btn {
    cursor: pointer;
  }
  .key {
    margin: 10px 0;
  }
  .title {
    margin: 20px 0 25px 0;
  }
  :global([data-theme='dark']) .revoke-btn {
    background-color: #ffffff;
  }
  code {
    background-color: var(--input-bg);
  }
  label {
    display: block;
    font-size: 14px;
    margin: 5px 0;
  }
  input {
    font-size: 16px;
  }
  p {
    font-size: 15px;
  }
</style>
