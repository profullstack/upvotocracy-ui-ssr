<script>
  import { onMount } from 'svelte'
  import { makeApiRequest, globalErrorHandler } from '../../components/create-api'

  let invoices = []

  onMount(async () => {
    const res = await makeApiRequest('/payments/list', null, { method: 'GET' })
      .catch(err => globalErrorHandler(err))
    invoices = await res.json()
  })
</script>

<svelte:head>
  <title>Invoices</title>
</svelte:head>

<h1>Invoices</h1>

<ul class="invoices">
{#each invoices as invoice}
  <li>
    <b>{invoice.date} {invoice.product}</b>
    {#each invoice.postId as post}
      <div>{post.title}</div>
    {/each}
    <div>Amount: ${invoice.amount} - {invoice.status} </div>
    <div>Payment Method: {invoice.paymentMethod}</div>
  </li>
{/each}
</ul>