<script context="module">
  export async function preload(page, session) {
    let scoops
    let { title, link, text, category, hashtags } = page.query;

    if (text) scoops = 'text';
    if (hashtags) {
      hashtags = JSON.parse(hashtags);
      hashtags = hashtags.map(hashtag => {
        if (hashtag.slice(0, 1) == '#') {
          hashtag = hashtag.substring(1);
        }
        return hashtag;
      });
    }
    
    return { title, link, text, category, scoops, hashtags };
  }
</script>
<script>
  import { onMount } from 'svelte'
  import { goto } from '@sapper/app';
  import { userStore, currentCategory, categories as cats } from '../store'
  import { makeApiRequest, globalErrorHandler } from '../components/create-api'
  import Upload from '../components/Upload.svelte'

  export let scoops = 'link'
  export let title = ''
  export let link = ''
  export let text = ''
  export let category
  export let hashtags = []
  let currentCat
  let thumb;
  let categories = []
  let sortedCategories = [];
  let newHashtag = '';
  let mediaName = null;

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

    const url = link != '' ? link : formData.get('url');
    const category = formData.get('category');
    const thumbEl = document.getElementById('thumb');
    const thumb = thumbEl && thumbEl.src.indexOf('placeholder.png') === -1 ? thumbEl.src : formData.get('type') == 'media' ? url : null;
    console.log(thumb, 'thumb');

    let res = await makeApiRequest('/posts', {
      type: formData.get('type'),
      category,
      title: formData.get('title').slice(0, 200).trim(),
      url: url && url.trim(),
      text: formData.get('text'),
      thumb,
      hashtags,
      mediaName,
    }, { method: 'POST' })
      .catch(err => globalErrorHandler(err))
    
    if (res.category) {
      return goto(`/a/${res.category.name}/${res.id}`);
    }

    return goto('/');
  }

  const addHashtag = async (event) => {
    newHashtag = newHashtag.trim(' ')

    if (newHashtag != '' && newHashtag != '#') {
      if (newHashtag.slice(0, 1) == '#') {
        newHashtag = newHashtag.substring(1);
      }
      if (!hashtags.includes(newHashtag)) {
        hashtags.push(newHashtag);
        hashtags = hashtags;
      }
      newHashtag = '';
    }
  };

  const removeHashtag = (val) => {
    const index = hashtags.indexOf(val);
    hashtags.splice(index, 1);
    hashtags = hashtags;
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
    display: flex;
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
  input[type="radio"]:checked + label{
    border-bottom: 0.1rem solid var(--link-color);
  }
  input[type="radio"].toggle + label {
    cursor: pointer;
    min-width: 60px;
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
      <input id="toggle-on" class="toggle" name="type" type="radio" bind:group={scoops} value={ 'link' }>
      <label for="toggle-on" class="btn">Link</label>
      <input id="toggle-off" class="toggle" name="type" type="radio" bind:group={scoops} value={ 'text' }>
      <label for="toggle-off" class="btn">Text</label>
      <input id="toggle-m" class="toggle" name="type" type="radio" bind:group={scoops} value={ 'media' }>
      <label for="toggle-m" class="btn">Media</label>
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
    {:else if scoops === 'text'}
      <label for="text">Text</label>
      <textarea placeholder="Put your text here ..." id="text" name="text" value="{text}"></textarea>
    {:else if scoops === 'media'}
      <Upload bind:link bind:mediaName/>
    {/if}
    <label for="hashtags">Hashtags</label>
    {#each hashtags as hashtag}
      #{hashtag} <a href="javascript:void(0)" on:click={ removeHashtag(hashtag) }>x</a>&nbsp
    {/each}
    <br>
    <input id="hashtags" bind:value={newHashtag}>
    <button on:click|preventDefault={addHashtag}>Add</button>
    <footer>
      <button class="button-primary float-right" type="submit" on:click={ createPost }>Create Post</button>
    </footer>
  </fieldset>
</form>
