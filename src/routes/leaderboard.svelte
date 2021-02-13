<script context="module">
  export async function preload(page, session) {
    let leaders = await this.fetch('API_BASE_URL/leaderboard');
    leaders = (await leaders.json()).leaders;
    return { leaders };
  }
</script>

<script>
  import { onMount } from 'svelte';
  import { abbreviateNumber } from '../utils/abbreviateNumber';
  import { timeSince } from '../utils/time';
  import copyToClipboard from '../utils/clipboard';

  export let leaders = [];
  let show = {
    even: true,
    karma: false,
  };
  let filteredLeaders = leaders;
  let usd = 1;
  let mbtc = 0;
  let addresses = '';
  let usdTotal = 0;
  let totalKarma = 0;
  let usdKarma = 1;
  let mbtcKarma = 0;
  let addressesKarma = '';
  let mbtcKarmaTotal = 0;
  let karmaMinusDust = 0;

  function sort(type = 'top') {
    if (type === 'top') {
      filteredLeaders = leaders.sort((a, b) => {
        return b.karma - a.karma;
      });
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
      });
    }
  }

  async function getExchangeRate(dollar) {
    const res = await fetch('https://blockchain.info/tobtc?currency=USD&value=' + dollar).then(
      (res) => {
        if (!res.ok) {
          console.error(res);
        }

        return res.text();
      },
    );

    return res;
  }

  async function getTransactions() {
    addresses = '';
    usdTotal = 0;
    mbtc = ((await getExchangeRate(usd)) * 1000).toFixed(4);
    const btcAddresses = leaders
      .filter((user) => user.bitcoinAddress)
      .map((user) => user.bitcoinAddress);

    btcAddresses.map((address) => {
      addresses += `${address},${mbtc}\n`;
      usdTotal += Number(usd);
    });
  }

  async function getKarmaTransactions() {
    addressesKarma = '';
    mbtcKarmaTotal = 0;
    totalKarma = 0;
    karmaMinusDust = 0;
    mbtc = ((await getExchangeRate(usdKarma)) * 1000).toFixed(4);

    leaders.filter((user) => user.bitcoinAddress).map((user) => (totalKarma += user.karma));

    const btcAddresses = leaders
      .filter((user) => user.bitcoinAddress)
      .map((user) => {
        return {
          karma: user.karma,
          btcAddress: user.bitcoinAddress,
          percent: (user.karma / totalKarma).toFixed(4),
          payout: mbtc * (user.karma / totalKarma),
        };
      });

    btcAddresses
      .filter((user) => user.payout > 0.00546)
      .map((user) => {
        debugger;
        addressesKarma += `${user.btcAddress},${user.payout.toFixed(8)}\n`;
        mbtcKarmaTotal += user.payout;
        karmaMinusDust += user.karma;

        console.log(karmaMinusDust);
      });
  }

  function showEvenPayout() {
    mbtc = 0;
    show.even = true;
    show.karma = false;
  }

  function showKarmaPayout() {
    show.even = false;
    show.karma = true;
  }
  function filter(type = 'btc') {
    if (type === 'btc') {
      filteredLeaders = leaders.filter((item) => {
        return item.bitcoinAddress;
      });
    } else if (type === 'all') {
      filteredLeaders = leaders;
    }
  }
</script>

<div class="leaderboard">
  <h1>Leaderboard</h1>

  <p>
    Generate a multiple payments transaction list for <a href="https://electrum.org"
      >Electrum wallet</a
    >. You can then send a payment to all our members by going to Send -> Tools -> Pay Many in
    Electrum (make sure your units are set to mBTC which is the default).
  </p>

  <nav>
    <a href="#" on:click|preventDefault={showEvenPayout}>Evenly Distributed Payout</a>
    <a href="#" on:click|preventDefault={showKarmaPayout}>Payout Distributed by Karma</a>
  </nav>
  <form on:submit|preventDefault={getTransactions} class:active={show.even}>
    <p>Send the dollar amount below to every user. Each user will get ${usd}</p>
    USD:<input class="input" type="usd" placeholder="USD Amount" bind:value={usd} />
    <span class="mbtc">mBTC: {mbtc}</span>
    <button class="btn-lrg">Go</button>
    <textarea class="input" id="addresses">{addresses}</textarea>
    <a href="#" on:click|preventDefault={() => copyToClipboard(addresses)}>copy</a>
    <div class="total">Total USD: ${usdTotal.toFixed(2)}</div>
  </form>
  <form on:submit|preventDefault={getKarmaTransactions} class:active={show.karma}>
    <p>Send the dollar amount below distributed by karma ratio to each user.</p>
    <p>
      Minimum payout must be greater than 0.00546 mBTC (due to <a
        href="https://support.blockchain.com/hc/en-us/articles/210354003-What-is-the-minimum-amount-I-can-send-"
        target="_new">dust</a
      >).
    </p>
    Total USD:<input class="input" type="usd" placeholder="USD Amount" bind:value={usdKarma} />
    <span class="mbtc">mBTC: {mbtc}</span>
    <button class="btn-lrg">Go</button>
    <textarea class="input" id="addressesKarma">{addressesKarma}</textarea>
    <a href="#" on:click|preventDefault={() => copyToClipboard(addressesKarma)}>copy</a>
    <div class="total">
      Total: {mbtcKarmaTotal.toFixed(4)} mBTC (minus dust). {karmaMinusDust} karma (minus dust) out of
      {totalKarma} total karma.
    </div>
  </form>

  <nav>
    <a href="javascript:void" on:click|preventDefault={() => sort('top')}>Top</a>
    <a href="javascript:void" on:click|preventDefault={() => sort('new')}>New</a>
    <a href="javascript:void" on:click|preventDefault={() => filter('all')}>All</a>
    <a href="javascript:void" on:click|preventDefault={() => filter('btc')}>BTC</a>
  </nav>

  <ol>
    {#each filteredLeaders as user}
      <li>
        <a href="/u/{user.username}">{user.username}</a>
        {user.karma}
        {#if user.created}
          <span class="meta">Joined {timeSince(user.created)} ago</span>
        {/if}
        {#if user.bitcoinAddress}
          <span class="bitcoin"
            >Bitcoin: <a href="bitcoin:{user.bitcoinAddress}">{user.bitcoinAddress}</a>
            <a href="#" on:click|preventDefault={() => copyToClipboard(user.bitcoinAddress)}>copy</a
            ></span
          >
        {/if}
        {#if user.nimiqAddress}
          <span class="nimiq"
          Jack, [13.02.21 01:31]
            >Nimiq: <a href="https://wallet.nimiq.com/nimiq:{user.bitcoinAddress}">{user.nimiqAddress}</a>
            <a href="#" on:click|preventDefault={() => copyToClipboard(user.nimiqAddress)}>copy</a
            ></span
          >
        {/if}
      </li>
    {/each}
  </ol>
</div>

<style>
  .leaderboard {
    display: flex;
    flex-direction: column;
    max-width: 750px;
    padding: 15px;
  }
  .btn-lrg {
    max-width: 80px;
  }
  ol {
    overflow-wrap: anywhere;
  }
  nav {
    margin: 1rem;
  }

  nav a {
    margin-right: 0.5rem;
  }

  form {
    display: none;
  }

  form.active {
    display: flex;
    flex-direction: column;
  }
  form > * {
    margin: 8px 0;
  }
  a {
    color: var(--green-accent);
  }
</style>
