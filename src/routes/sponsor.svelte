<script context="module">
  export async function preload(page, session) {
    let queryPostId
    if (page.query.postId) queryPostId = page.query.postId
    
    return { queryPostId };
  }
</script>
<script>
  import Stripe from '../components/payments/Stripe.svelte'
  import { makeApiRequest, globalErrorHandler } from '../components/create-api.js';
  import { onMount } from 'svelte'
  import { userStore, globalError } from '../store'
  import copyToClipboard  from '../utils/clipboard'
  import Spinner from '../components/Spinner.svelte'

  export let queryPostId
  let showStripe = false
  let showBTC = false
  let isLoading = false
  let paymentIntent
  let userPosts = []
  let selectedPosts = []
  let currentPost
  let qr
  let address
  let amt
  let invId
  let isLoadingStatus = false;
  let intv
  let payStatus

  let user
  userStore.subscribe(data => user = data)

  const pay = async (paymentMethod) => {
    if (selectedPosts.length != 0) {
      isLoading = true
      let postId = []
      selectedPosts.forEach((post) => postId.push(post.id))

      const res = await makeApiRequest('/payments/create', {
        paymentMethod,
        postId,
      },{ 
        method: 'POST'
      }).catch(err => globalErrorHandler(err))

      if(paymentMethod == 'CARD') {
        paymentIntent = await res.json()
        isLoading = false
        showStripe = true
      }

      if (paymentMethod == 'BTC') {
        const response = await res.json()
        isLoading = false
        qr = response.qr
        address = response.address
        amt = response.amount
        invId = response.invoiceId
        showBTC = true
        intv = setInterval(checkPayment, 3000);
      }
    }
    else {
      globalError.set('Please choose 1 or more posts')
    }
  }

  const addToSelected = async () => {
    if (currentPost !== 'Select post...') {
      globalError.set(false)

      selectedPosts.push(currentPost)
      selectedPosts = selectedPosts

      const index = userPosts.findIndex(i => i.id === currentPost.id);
      userPosts.splice(index, 1);
      userPosts = userPosts;
      currentPost = 'Select post...';
    }
  }

  const removeFromSelected = async (post) => {
    userPosts.push(post)
    userPosts = userPosts
    const index = selectedPosts.findIndex(i => i.id === post.id);
    selectedPosts.splice(index, 1);
    selectedPosts = selectedPosts;
  }

  async function checkPayment() {
    isLoadingStatus = true;
    let response = await makeApiRequest('/payments', {
      id: invId,
    }, {
      method: 'POST'
    })
    .catch(err => {
      isLoadingStatus = false;
      globalErrorHandler(err)
      clearInterval(intv);
      return;
    })

    response = await response.json()

    payStatus = response.status

    if (payStatus === 'paid'){
      isLoadingStatus = false;
      clearInterval(intv)
    }
  }


  onMount(async () => {
    const res = await makeApiRequest(`/posts/user/${user.id}`, null, { method: 'GET' })
      .catch(err => globalErrorHandler(err))
    if (!res.ok) return
    userPosts = await res.json()
    userPosts = userPosts.filter((post) => post.sponsored != true)

    const index = userPosts.findIndex(post => post.id == queryPostId);
    currentPost = userPosts[index];

  })
</script>

<style>
  li {
    list-style: none;
  }
</style>

<svelte:head>
    <title>Sponsored posts</title>
</svelte:head>

<h1>Sponsored posts</h1>

<h5>You can help fund our growing community by sponsoring a post.</h5>
<p>Sponsored posts cost $10 each and will be rotated randomly along with other sponsored posts throughout the category. It does not expire.</p>

<p>We currently get around 12k pageviews a month. 20% of profits get distributed back to active members based on karma.</p>

<form>
  <label>Choose from your posts</label>
  <select bind:value={currentPost}>
    <option>Select post...</option>
    {#each userPosts as post}
      <option value={post}>{post.title}</option>
    {/each}
  </select>
  <button on:click|preventDefault={addToSelected}>Add</button>
  <h4>Selected posts:</h4>
  <ul>
    {#each selectedPosts as post}
      <li>{post.title} <a href="javascript:void(0)" on:click={() => removeFromSelected(post)}>X</a></li>
    {/each}
  </ul>
  <h4>Total: ${selectedPosts.length * 10}</h4>
</form>


<button on:click={() => { pay('BTC'); showStripe = false }}>Pay With Bitcoin</button>
<button on:click={() => { pay('CARD'); showBTC = false }}>Pay by card</button>

{#if isLoading}
  <Spinner/>
{/if}

{#if showStripe}
  <Stripe paymentIntent={paymentIntent} />
{/if}

{#if showBTC && qr}
<div>
  <img src="{qr}" alt={address}>
  <a href="javascript:void(0)" on:click|preventDefault={() => copyToClipboard(address)}>Copy</a>

  <div class="payment">
    <h4>Payment address:</h4>
    <input value="{address}">
    <h4>
      Pay this amount: {amt} BTC
      <a href="javascript:void(0)" on:click|preventDefault={() => copyToClipboard(amt)}>Copy</a>
     </h4>
    <h4 class="status">Status: {payStatus} {#if isLoadingStatus}<Spinner /> Awaiting payment...{/if}</h4>
    {#if payStatus === 'paid'}
      <p>Once an invoice is marked as "paid" you are done; however we wait for 1 confirmation to complete your purchase, which can take 10-30 minutes.</p>
      <p>You may check your payment status for confirmation on the <a href="/settings/invoices">invoices</a> page.</p>
    {/if}
  </div>
</div>
{/if}