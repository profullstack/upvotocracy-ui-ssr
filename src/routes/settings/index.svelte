<script>
  import { goto } from '@sapper/app';
  import { userStore } from '../../store';
  import { onMount } from 'svelte';
  import { makeApiRequest, globalErrorHandler } from '../../api/create-api';

  let user;
  let isEditingFieldBT = false;
  let isEditingFieldLinks = false;
  let numLinks = 1;

  userStore.subscribe((val) => (user = val));

  const newLink = (event) => {
    event.preventDefault();
    if (numLinks < 3) {
      numLinks++;
      console.log(numLinks);
    }
    if (user.links.length > 0 && user.links.length < 3) {
      user.links.push({ name: '', url: '' });
      user.links = user.links;
    }
  };

  const deleteLink = (e, i) => {
    e.preventDefault();
    if (user.links.length > 0 && user.links.length <= 3) {
      if (i > -1) {
        user.links.splice(i, 1);
        user.links = user.links;
      }
    }
  };

  const updateBT = async (event) => {
    event.preventDefault();
    const form = document.getElementById('settings');
    const token = localStorage.getItem('token');
    const formData = new FormData(form);

    const url = '/me/bitcoinaddress';
    const res = await makeApiRequest(
      url,
      {
        bitcoinaddress: formData.get('bitcoinAddress'),
      },
      { method: 'POST' },
    ).catch((err) => globalErrorHandler(err));
  };

  const updateNIM = async (event) => {
    event.preventDefault();
    const form = document.getElementById('settings');
    const token = localStorage.getItem('token');
    const formData = new FormData(form);

    const url = '/me/nimiqaddress';
    const res = await makeApiRequest(
      url,
      {
        nimiqaddress: formData.get('nimiqAddress'),
      },
      { method: 'POST' },
    ).catch((err) => globalErrorHandler(err));
  };

  const updateLinks = async (event) => {
    event.preventDefault();
    const form = document.getElementById('links');
    const token = localStorage.getItem('token');
    const formData = new FormData(form);
    let links = [];

    for (let i = 0; i < Math.max(numLinks, user.links.length); i++) {
      if (
        formData.get(`link-name${i}`) != '' &&
        formData.get(`link-url${i}`) != '' &&
        formData.get(`link-name${i}`) != null &&
        formData.get(`link-url${i}`) != null
      ) {
        links.push({ name: formData.get(`link-name${i}`), url: formData.get(`link-url${i}`) });
      }
    }
    const url = '/me/links';
    const res = await makeApiRequest(
      url,
      {
        socialLinks: links,
      },
      { method: 'POST' },
    ).catch((err) => globalErrorHandler(err));
  };
</script>

<svelte:head>
  <title>Settings - General Settings</title>
</svelte:head>

<div>
  <form id="settings">
    <label for="btAddress">Bitcoin Address</label>
    {#if user.bitcoinAddress != null}
      <input
        class="input"
        type="text"
        placeholder="Bitcoin Address"
        id="btAddress"
        name="bitcoinAddress"
        value={user.bitcoinAddress}
      />
    {:else}
      <input type="text" placeholder="Bitcoin Address" id="btAddress" name="bitcoinAddress" />
    {/if}

    <label for="nimAddress">Nimiq Address</label>
    {#if user.nimiqAddress != null}
      <input
        class="input"
        type="text"
        placeholder="Nimiq Address"
        id="nimAddress"
        name="nimiqAddress"
        value={user.nimiqAddress}
      />
    {:else}
      <input type="text" placeholder="Nimiq Address" id="nimAddress" name="nimiqAddress" />
    {/if}
  </form>
  <form id="links">
    {#if user.links.length > 0}
      <h3>Social Links</h3>
      {#each user.links as link}
        <div class="link">
          <a href="#" class="float-right" on:click={(e) => deleteLink(e, user.links.indexOf(link))}
            >Delete</a
          >
          <label for="name">Name</label>
          <input
            class="input"
            type="text"
            placeholder="Name"
            name={`link-name${user.links.indexOf(link)}`}
            value={link.name}
          />
          <label for="url">Url</label>
          <input
            class="input"
            type="text"
            placeholder="Url"
            name={`link-url${user.links.indexOf(link)}`}
            value={link.url}
          />
        </div>
      {/each}
      <button class="btn-lrg new-btn" on:click={newLink}>New Link</button>
    {:else}
      <h3>Social Links</h3>
      {#each Array(numLinks) as _, i}
        <div class="link">
          <label for="name">Name</label>
          <input class="input" type="text" placeholder="Name" name={`link-name${i}`} />
          <label for="url">Url</label>
          <input class="input" type="text" placeholder="Url" name={`link-url${i}`} />
        </div>
      {/each}
      <button class="btn-lrg new-btn" on:click={newLink}>New Link</button>
    {/if}
  </form>
  <button
    class="btn-lrg submit-btn"
    type="submit"
    on:click={(e) => {
      updateLinks(e);
      updateBT(e);
      updateNIM(e);
    }}>Save Settings</button
  >
</div>

<style>
  form {
    margin: 20px 0;
  }
  label {
    display: block;
    font-size: 14px;
  }
  input {
    display: block;
    box-sizing: border-box;
    width: 100%;
    margin: 10px 0;
  }
  .link {
    margin: 20px 0;
  }
  .new-btn {
    background-color: #1f2724;
  }
  .float-right {
    float: right;
  }
  .submit-btn {
    margin: 20px 0;
  }
  :global([data-theme='dark']) .new-btn {
    background-color: #ffffff;
  }
</style>
