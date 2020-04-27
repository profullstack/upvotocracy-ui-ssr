<script>
import { goto } from '@sapper/app'
import { userStore } from '../../store'
import { onMount } from 'svelte'
import { makeApiRequest, globalErrorHandler } from '../../components/create-api'

let user
let isEditingFieldBT = false;
let isEditingFieldLinks = false;
let numLinks = 1;

const newLink = (event) => {
  event.preventDefault()
  if (numLinks < 3) {
    numLinks++
  }
  if (user.links.length > 0 && user.links.length < 3) {
    user.links.push({name: "", url: ""});
    user.links = user.links;
  }
}

const deleteLink = (e, i) => {
  e.preventDefault();
   if (user.links.length > 0 && user.links.length <= 3) {
    if (i > -1) {
      user.links.splice(i, 1);
      user.links = user.links;
    }
  }
}

const updateBT = async (event) => {
  event.preventDefault()
  const form = document.getElementById('settings')
  const token = localStorage.getItem('token')
  const formData = new FormData(form)

  const url = '/me/bitcoinaddress'
  const res = await makeApiRequest(url, {
    bitcoinaddress: formData.get('bitcoinAddress')
  },
  { method: 'POST' })
    .catch(err => globalErrorHandler(err))
}

const updateLinks = async (event) => {
  event.preventDefault()
  const form = document.getElementById('links')
  const token = localStorage.getItem('token')
  const formData = new FormData(form)
  let links = []

  for (let i=0; i < Math.max(numLinks, user.links.length); i++) {
    if (formData.get(`link-name${i}`) != "" && formData.get(`link-url${i}`) != "" && formData.get(`link-name${i}`) != null && formData.get(`link-url${i}`) != null) {
      links.push({name: formData.get(`link-name${i}`), url: formData.get(`link-url${i}`)})
    }
  }
  const url = '/me/links'
  const res = await makeApiRequest(url, {
    socialLinks: links
  },
  { method: 'POST' })
    .catch(err => globalErrorHandler(err))
}

const fetchMe = async () => {
  let url = '/me';
  user = await makeApiRequest(url, null, { method: 'GET' })
    .catch(err => globalErrorHandler(err))

  userStore.set(user);
}

onMount(() => {
  fetchMe();
})

</script>

<div>
{#if user}
<a href="/settings/invoices"><button>Your Invoices</button></a>
<form id="settings">
  <fieldset>
    <legend>Bitcoin Address</legend>
    {#if user.bitcoinAddress != null}
      <input type="text" placeholder="Bitcoin Address" id="btAddress" name="bitcoinAddress" value={user.bitcoinAddress}> 
    {:else}
      <input type="text" placeholder="Bitcoin Address" id="btAddress" name="bitcoinAddress">
    {/if}
  </fieldset>
</form>



<form id="links">
  {#if user.links.length > 0}
    <fieldset>
      <legend>Social Links</legend>
      {#each user.links as link} 
        <span>Link {user.links.indexOf(link) + 1}</span>
        <a href="#" class="float-right" on:click={(e) => deleteLink(e, user.links.indexOf(link))}>Delete</a>
        <input type="text" placeholder="Name" name={`link-name${user.links.indexOf(link)}`} value={link.name}>
        <input type="text" placeholder="Url" name={`link-url${user.links.indexOf(link)}`} value={link.url}>
      {/each}
        <button class="button-primary float-right" on:click={newLink}>New Link</button>
    </fieldset>
{:else}
    <fieldset>
      <legend>Social Links</legend>
      {#each Array(numLinks) as _, i}
        <input type="text" placeholder="Name" name={`link-name${i}`}>
        <input type="text" placeholder="Url" name={`link-url${i}`}> 
      {/each}
      <button class="button-primary" on:click={newLink}>New Link</button>
    </fieldset>
    {/if}
</form>

<button class="button-primary" type="submit" on:click={(e) => {updateLinks(e); updateBT(e);}}>Save</button>

{/if}
</div>