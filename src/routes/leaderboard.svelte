<script context="module">
  export async function preload(page, session) {
    let leaders = await this.fetch('API_BASE_URL/leaderboard');
    leaders = (await leaders.json()).leaders;
    return { leaders }
  }
</script>
<script>
import { onMount } from 'svelte';
import { abbreviateNumber } from '../utils/abbreviateNumber';
import { timeSince } from '../utils/time';
import copyToClipboard from '../utils/clipboard';

export let leaders = [];
let filteredLeaders = leaders;
let usd = 1;
let mbtc = 0;
let addresses = '';


function sort(type = 'top') {
  if (type === 'top') {
    filteredLeaders = leaders.sort((a, b) => {
      return b.karma - a.karma;
    })
  } else if (type === 'new') {
    filteredLeaders = leaders.sort((a, b) => {
      let aDate = new Date(a.created).getTime();
      let bDate = new Date(b.created).getTime();

      if (!aDate) {
        aDate = 0;
      }

      if (!bDate) {
        bDate = 0;
      }
      return bDate - aDate;
    })
  }
}

async function getExchangeRate(){
  const res = await fetch('https://blockchain.info/tobtc?currency=USD&value='+usd)
    .then(res => {
      if (!res.ok) {
        console.error(res);
      }

      return res.text();
    });

  return res;
}

async function getTransactions() {
  mbtc = ((await getExchangeRate()) * 1000).toFixed(4);
  const btcAddresses = leaders.filter(user => user.bitcoinAddress).map(user => user.bitcoinAddress);

  btcAddresses.map(address => {
    addresses += `${address},${mbtc}\n`;
  })
}


function filter(type = 'btc') {
  if (type === 'btc') {
    filteredLeaders = leaders.filter(item => {
      return item.bitcoinAddress;
    })
  } else if (type === 'all') {
    filteredLeaders = leaders;
  }
}
</script>

<style>
  nav {
    margin: 1rem;
  }

  nav a {
    margin-right: .5rem;
  }
</style>

<h1>Leaderboard</h1>

<nav>
  <a href="javascript:void" on:click|preventDefault={() => sort('top')}>Top</a>
  <a href="javascript:void" on:click|preventDefault={() => sort('new')}>New</a>
  <a href="javascript:void" on:click|preventDefault={() => filter('all')}>All</a>
  <a href="javascript:void" on:click|preventDefault={() => filter('btc')}>BTC</a>
</nav>
<p>Generate a multiple payments transaction list for <a href="https://electrum.org">Electrum wallet</a>.
 You can then send to all our members a payment.</p>
<form on:submit|preventDefault={getTransactions}>
  <input type="usd" placeholder="USD Amount" value={usd}>
  <span class="mbtc">mBTC: {mbtc}</span>
  <button>Go</button>
  <textarea id="addresses">{addresses}</textarea>
  <a href="#" on:click|preventDefault={() => copyToClipboard(addresses)}>copy</a>
</form>

<ol>
{#each filteredLeaders as user}
  <li>
    <a href="/u/{user.username}">{user.username}</a> {user.karma}
    {#if user.created}
      <span class="meta">Joined {timeSince(user.created)} ago</span>
    {/if}
    {#if user.bitcoinAddress}
      <span class="bitcoin">Bitcoin: <a href="bitcoin:{user.bitcoinAddress}">{user.bitcoinAddress}</a> <a href="#" on:click|preventDefault={() => copyToClipboard(user.bitcoinAddress)}>copy</a></span>
    {/if}
  </li>
{/each}
</ol>