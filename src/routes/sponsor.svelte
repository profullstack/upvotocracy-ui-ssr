<script>
  import Stripe from '../components/payments/Stripe.svelte'
  import { makeApiRequest, globalErrorHandler } from '../components/create-api.js';
  import { onMount } from 'svelte'
  import { userStore, globalError } from '../store'

  let showStripe = false
  let showBTC = false
  let paymentIntent
  let userPosts = []
  let selectedPosts = []
  let currentPost
  let qr
  let address
  let amt

  let user
  userStore.subscribe(data => user = data)

  const pay = async (paymentMethod) => {
    if (selectedPosts.length != 0) {
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
        showStripe = true
      }

      if (paymentMethod == 'BTC') {
        const response = await res.json()
        qr = response.qr
        address = response.address
        amt = response.amount
        showBTC = true
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


  onMount(async () => {
    const res = await makeApiRequest(`/posts/user/${user.id}`, null, { method: 'GET' })
      .catch(err => globalErrorHandler(err))
    if (!res.ok) return
    userPosts = await res.json()
    userPosts = userPosts.filter((post) => post.sponsored != true)
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


<button on:click={() => pay('BTC')}>Pay With Bitcoin</button>
<button on:click={() => pay('CARD')}>Pay by card</button>

{#if showStripe}
  <Stripe paymentIntent={paymentIntent} />
{/if}

{#if showBTC}
<div>
  {#if qr}
    <img src="{qr}" alt={address}>
    <a href="javascript:void(0)" on:click|preventDefault={() => copyToClipboard(address)}>Copy</a>

    <div class="payment">
      <h4>Payment address:</h4>
      <input value="{address}">
      <h4>
        Pay this amount: {amt} BTC
        <a href="javascript:void(0)" on:click|preventDefault={() => copyToClipboard(amt)}>Copy</a>
       </h4>
      <!-- <h4 class="status">Status: {payStatus} {#if isLoadingStatus}<Spinner /> Awaiting payment...{/if}</h4>
      {#if payStatus === 'paid'} -->
      <p>Once an invoice is marked as "paid" you are done; however we wait for 1 confirmation to upgrade your account, which can take 10-30 minutes.</p>
      <p>You may check your payment status for confirmation on the <a href="/settings">invoices</a> page.</p>
      <!-- {/if} -->
    </div>
  {/if}
</div>
{/if}