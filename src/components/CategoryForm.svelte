<script>
  import { onMount } from 'svelte';
  import { goto } from '@sapper/app';
  import { userStore } from '../store';
  import { makeApiRequest, globalErrorHandler } from '../api/create-api';
  import Upload from '../components/Upload.svelte';

  export let category = null;
  let nsfw = category ? category.nsfw : false;
  let imageLink = category ? category.imageLink : null;
  let name = category ? category.name : '';
  let description = category ? category.description : '';

  let user;

  userStore.subscribe((value) => {
    user = value;
  });

  onMount(() => {
    if (!user) goto('/');
  });

  let msg = {
    error: '',
  };

  const createCategory = async (event) => {
    event.preventDefault();
    const url = '/category';
    const res = await makeApiRequest(
      url,
      {
        _id: category ? category._id : null,
        name,
        description,
        nsfw,
        image: imageLink,
      },
      { method: category ? 'PUT' : 'POST' },
    ).catch((err) => globalErrorHandler(err));

    if (!res) return;
    goto(`/a/${name}`);
  };
</script>

{#if !msg.ok} <div class="message error">{msg.error}</div>{/if}

<form id="create-category">
  <label for="upload">Upload Category Image</label>
  <Upload bind:link={imageLink} acceptTypes="image/*" />
  <label for="name">Category Name</label>
  <input
    bind:value={name}
    class="input"
    type="text"
    placeholder="Put the category name here ..."
    id="name"
    name="name"
  />
  <label for="description">Description</label>
  <textarea
    bind:value={description}
    class="input"
    placeholder="Put the description here ..."
    id="description"
    name="description"
  />
  <span>Mark NSFW? <input type="checkbox" bind:checked={nsfw} /></span>
  <button class="btn-lrg" type="submit" on:click={createCategory}>Submit</button>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-width: 400px;
    padding: 10px;
  }
  label {
    font-display: normal;
    font-weight: 300;
    font-size: 1em;
    margin: 10px 0;
  }
</style>
