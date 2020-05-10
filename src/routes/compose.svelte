<script context="module">
  export async function preload(page, session) {
    let scoops
    const { title, link, text, category } = page.query;

    if (text) scoops = 'text';
    
    return { title, link, text, category, scoops };
  }
</script>
<script>
  import { onMount } from 'svelte'
  import { goto } from '@sapper/app';
  import { userStore, currentCategory, categories as cats } from '../store'
  import { makeApiRequest, globalErrorHandler } from '../components/create-api'

  export let scoops = 'link'
  export let title = ''
  export let link = ''
  export let text = ''
  export let category
  let currentCat
  let thumb;
  let categories = []
  let sortedCategories = [];

  let user
  userStore.subscribe(value => {
    user = value
  })

  if (category) currentCategory.set(category)
  currentCategory.subscribe(value => {
    currentCat = value
  })

  cats.subscribe(value => {
    categories = value
  })

  async function onUrlBlur(e) {
    const form = document.getElementById('create-post');
    const formData = new FormData(form);
    const url = formData.get('url');
    const title = formData.get('title');

    if (!url) return;

    const res = await getTitle(url);

    if (res.thumb) {
      thumb = res.thumb;
      document.getElementById('thumb').src = thumb;
    }

    if (!title) {
        document.getElementById('title').value = res.title.slice(0, 200).trim();      
    }
  }

  onMount(async () => {
    if (!user) goto('/')

    sortedCategories = categories.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;
    });
  })

  async function getTitle(url) {
    let res = await makeApiRequest(`/retrieve?url=${url}`, null, { method: 'GET', noauth: true })
      .catch(err => globalErrorHandler(err))

    if (!res) return

    res.title = res.title.slice(0, 200).trim();
    res.thumb = res.thumb && res.thumb.replace('http://', 'https://');
    return res;
  }

  const createPost = async (event) => {
    event.preventDefault()
    await onUrlBlur();
    const form = document.getElementById('create-post')
    const formData = new FormData(form);
    form.reset()

    const url = formData.get('url');
    const category = formData.get('category');
    const thumbEl = document.getElementById('thumb');
    const thumb = thumbEl && thumbEl.src.indexOf('placeholder.png') === -1 ? thumbEl.src : null;
    console.log(thumb, 'thumb');

    let res = await makeApiRequest('/posts', {
      type: formData.get('type'),
      category,
      title: formData.get('title').slice(0, 200).trim(),
      url: url && url.trim(),
      text: formData.get('text'),
      thumb,
    }, { method: 'POST' })
      .catch(err => globalErrorHandler(err))
    
    if (res.category) {
      return goto(`/a/${res.category.name}/${res.id}`);
    }

    return goto('/');
  }
</script>

<style>
  label {
    font-display: normal;
    font-weight: 300;
    font-size: 1em;
  }
  .category-toggle {
    margin-bottom: 1.5em;
  }
  .btn {
    display: inline-block;
    padding: .2em;
    width: 50%;
    position: relative;
    text-align: center;
    transition: background 600ms ease, color 600ms ease;
  }
  input[type="radio"].toggle {
    display: none;
  }
  input[type="radio"].toggle + label {
    cursor: pointer;
    min-width: 60px;
  }
  input[type="radio"].toggle + label:hover {
    background: none;
  }
  input[type="radio"].toggle + label:after {
    border-bottom: 0.1rem solid var(--link-color);
    content: "";
    height: 100%;
    position: absolute;
    top: 0;
    transition: left 200ms cubic-bezier(0.77, 0, 0.175, 1);
    width: 100%;
    z-index: -1;
  }
  input[type="radio"].toggle.toggle-left + label {
    border-right: 0;
  }
  input[type="radio"].toggle.toggle-left + label:after {
    left: 100%;
  }
  input[type="radio"].toggle.toggle-right + label {
    margin-left: -5px;
  }
  input[type="radio"].toggle.toggle-right + label:after {
    left: -100%;
  }
  input[type="radio"].toggle:checked + label {
    cursor: default;
    color: var(--link-color);
    transition: color 200ms;
  }
  input[type="radio"].toggle:checked + label:after {
    left: 0;
  }

  #thumb {
    width: 20rem;
    margin: 0 .5rem .5rem;
  }

  .thumbnail {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: row;
  }
</style>

<form id="create-post">
  <fieldset>
    <div class="category-toggle">
      <input id="toggle-on" class="toggle toggle-left" name="type" type="radio" checked bind:group={scoops} bind:value={ 'link' }>
      <label for="toggle-on" class="btn">Link</label>
      <input id="toggle-off" class="toggle toggle-right" name="type" type="radio" bind:group={scoops} value={ 'text' }>
      <label for="toggle-off" class="btn">Text</label>
    </div>
    <label for="category">Category</label>
    <select id="category" name="category">
      {#each sortedCategories as category}
        {#if category.name == currentCat}
          <option value="{ category._id }" selected>{ category.name }</option>
        {:else}
          <option value="{ category._id }">{ category.name }</option>
        {/if}
      {/each}
    </select>
    <label for="title">Title</label>
    <input type="text" placeholder="Put your title here ..." id="title" name="title" value="{title}">
    {#if scoops === 'link'}
      <label for="url">Link</label>
      <input type="text" placeholder="https:// ..." id="url" name="url" on:blur={onUrlBlur} value="{link}">
      <label for="thumb">Thumbnail</label>
      <div class="thumbnail">
        <img id="thumb" src="/images/placeholder.png" alt="Thumbnail" />
        <button type="button" on:click={onUrlBlur}>Fetch</button>
      </div>
      {:else}
      <label for="text">Text</label>
      <textarea placeholder="Put your text here ..." id="text" name="text" value="{text}"></textarea>
    {/if}
    <footer>
      <button class="button-primary float-right" type="submit" on:click={ createPost }>Create Post</button>
    </footer>
  </fieldset>
</form>
