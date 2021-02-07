<script>
  import { onMount } from 'svelte';
  import { makeApiRequest, globalErrorHandler } from '../../api/create-api';

  let invoices = [];

  onMount(async () => {
    invoices = await makeApiRequest('/payments/list', null, { method: 'GET' }).catch((err) =>
      globalErrorHandler(err),
    );
  });
</script>

<svelte:head>
  <title>Settings - Invoices</title>
</svelte:head>

{#if invoices && invoices.length > 0}
  <ul class="invoices">
    {#each invoices as invoice}
      <li>
        <b>{new Date(invoice.date).toLocaleString()} {invoice.product}</b>
        {#each invoice.postId as post}
          <div><a rel="prefetch" href="/a/{post.category.name}/{post.id}">{post.title}</a></div>
        {/each}
        <div>Amount: ${invoice.amount} - {invoice.status}</div>
        <div>Payment Method: {invoice.paymentMethod}</div>
      </li>
    {/each}
  </ul>
{/if}

<style>
</style>
