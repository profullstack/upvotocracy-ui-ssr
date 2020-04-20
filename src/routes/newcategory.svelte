<script>
  import { onMount } from 'svelte'
  import { goto } from '@sapper/app'
  import { userStore } from '../store'
  import { makeApiRequest, globalErrorHandler } from '../components/create-api'

  let nsfw = false

  let user  

  userStore.subscribe(value => {
    user = value
  })

  onMount(() => {
    if (!user) goto('/')
  })

  let msg = {
    error: ''
  }

  const createCategory = async (event) => {
    event.preventDefault()
    const form = document.getElementById('create-category')
    const formData = new FormData(form)
    form.reset()

    const token = localStorage.getItem('token')
    const name = formData.get('name');
    const url = '/category'
    const res = await makeApiRequest(url, {
      name,
      description: formData.get('description'),
      nsfw,
    },
    { method: 'POST' })
      .catch(err => globalErrorHandler(err))

    if (res.ok) {
      goto(`/a/${name}`);
    }    
  }
</script>

<style>
  label {
    font-display: normal;
    font-weight: 300;
    font-size: 1em;
  }
</style>

{#if !msg.ok} <div class="message error">{msg.error}</div>{/if}

<form id="create-category">
  <fieldset>
    <label for="name">Category Name</label>
    <input type="text" placeholder="Put the category name here ..." id="name" name="name">
    <label for="description">Description</label>
    <textarea placeholder="Put the description here ..." id="description" name="description"></textarea>
    <span>Mark NSFW? <input type="checkbox" bind:checked={nsfw}></span>
    <button class="button-primary float-right" type="submit" on:click={ createCategory }>Submit</button>
  </fieldset>
</form>
