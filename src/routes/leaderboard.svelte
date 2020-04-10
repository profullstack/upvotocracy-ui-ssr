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

export let leaders = [];

function sort(type = 'top') {
  if (type === 'top') {
    leaders = leaders.sort((a, b) => {
      return b.karma - a.karma;
    })
  } else if (type === 'new') {
    leaders = leaders.sort((a, b) => {
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


// onMount(async () => {
//   const res = await getLeaderBoard()
//     .catch(console.error);

//   if (res) {
//     leaders = res.leaders;
//   }
// })
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
</nav>

<ol>
{#each leaders as user}
  <li>
    <a href="/u/{user.username}">{user.username}</a> {user.karma}
    {#if user.created}
      <span class="meta">Joined {timeSince(user.created)} ago</span>
    {/if}
    {#if user.bitcoinAddress}
      <span class="bitcoin">Bitcoin: <a href="bitcoin:{user.bitcoinAddress}">{user.bitcoinAddress}</a></span>
    {/if}
  </li>
{/each}
</ol>