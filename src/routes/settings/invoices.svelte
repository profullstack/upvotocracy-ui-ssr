<script>
  import { onMount } from 'svelte'
  import { makeApiRequest, globalErrorHandler } from '../../components/create-api'

  let invoices = []

  onMount(async () => {
    invoices = await makeApiRequest('/payments/list', null, { method: 'GET' })
      .catch(err => globalErrorHandler(err))
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
      <div><a rel="prefetch" href="/a/{post.category.name}/{post.id}">{post.title}</a></div>
    {/each}
    <div>Amount: ${invoice.amount} - {invoice.status} </div>
    <div>Payment Method: {invoice.paymentMethod}</div>
  </li>
{/each}
</ul>