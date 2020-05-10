<script context="module">
  export async function preload(page, session) {
    const res = await this.fetch(`API_BASE_URL/category`);
    const article = await res.json();
    const cats = article
    return { cats };
  }
</script>
<script>
  import GoogleAnalytics from "sapper-google-analytics/GoogleAnalytics.svelte"
	import Navbar from '../components/Navbar.svelte';
	import Sidebar from '../components/Sidebar.svelte';
  import { onMount } from 'svelte'
  import { categories, globalError } from '../store'
  import { stores } from '@sapper/app';
  const { page } = stores();

	export let cats;
  categories.set(cats);
  let ga_measurment_id = 'GOOGLE_ANALYTICS'
  let err;
  globalError.subscribe(msg => err = msg);

  let currentPath;
  page.subscribe(data => currentPath = data.path)

  $: {
    currentPath;
    globalError.set(false);
  }

  onMount(() => {
    document.getElementById('bookmarklet').setAttribute('href', "javascript:void(open(`SITE_URL/compose?link=${encodeURIComponent(`${location.href}${location.href.includes('?')?'&':'?'}_snoorandom=${crypto.getRandomValues(new Uint8Array(4)).reduce((a,v)=>a+=(v.toString(16).padStart(2,'0')),'')}`)}&title=${encodeURIComponent(document.querySelector('meta[name=title][content]')?document.querySelector('meta[name=title][content]').content:document.title)}`))");
  })
</script>

<style>
  :global(.row) {
    justify-content: center;
  }
  :global(a) {
    color: var(--link-color);
    font-weight: 500;
  }

  :global(button) {
    background-color: var(--link-color);
    border-color: var(--link-color);
  }

  :global(.button.button-outline, button.button-outline){
    border-color: var(--link-color);
    color: var(--link-color);
  }

  :global(input[type="radio"].toggle:checked+label){
    color: var(--link-color);
  }

  :global(input[type='text']:focus, textarea:focus, select:focus) {
    border-color: var(--link-color);
  }

  :global(input[type="radio"].toggle+label:after) {
    border-bottom-color: var(--link-color);
  }

  .container {
    max-width: 75%;
  }
  .main {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }
  .content {
    margin-top: 2rem;
    padding: 1rem;
    word-wrap: anywhere;
    width: 100%;
  }
  .error {
    color: #d70707;
  }

  footer > div {
    font-size: 1.2rem;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-wrap: wrap;
    margin: 0 2rem;
  }

  footer > div * {
    margin-left: 1rem;
  }

  @media only screen and (max-width: 1650px) {
    .container {
      max-width: 100%;
      padding: 0px;
    }
    :global(.row) {
      max-width: 90%;
    }
  }
</style>

<div class="container">
  <Navbar/>
  <div class="main">
    <Sidebar/>
    <div class="content">
      {#if err}
        <div class="error">
          <p>{err}</p>
        </div>
      {/if}
      <main>
      	<slot></slot>
      </main>
      <footer>
        <div>
          <a href="/leaderboard">Leaderboard</a>
          <a id="bookmarklet" href="#" title="Drag to bookmark bar">Bookmarklet</a>
          <a href="SITE_URL/api/1/posts/rss">RSS</a>
          <a href="/sponsor">Advertise</a>
          <a href="mailto:SITE_EMAIL?subject=SITE_EMAIL_SUBJECT">SITE_EMAIL</a>
          <a href="https://github.com/profullstack/upvotocracy-ui-ssr" title="MIT">open source</a>
          <a href="https://www.facebook.com/pg/upvoGoCrazy/" title="Facebook: upvoGoCrazy">Facebook</a>
          <a href="https://profullstack.com">Profullstack.com</a>
          <span class="legal">&copy; 2020</span>
        </div>
        <div>
          <a href="https://discord.gg/VfGmeKn">Discord</a>
					<a href="https://reddit.com/r/CouponsDealsSavings">r/CouponsDealsSavings</a>
        </div>
      </footer>
    </div>
  </div>
    <GoogleAnalytics {stores} id={ga_measurment_id}/>
</div>
