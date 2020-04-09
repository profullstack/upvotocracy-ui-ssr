<script context="module">
  export async function preload(page, session) {
    const res = await this.fetch(`API_BASE_URL/category`);
    const article = await res.json();
    const cats = article
    console.log(cats.length)
    return { cats };
  }
</script>
<script>
	import Navbar from '../components/Navbar.svelte';
	import Sidebar from '../components/Sidebar.svelte';
  import { categories } from '../store'

	export let segment;
	export let cats;

  categories.set(cats)
</script>

<style>
  :global(.row) {
    justify-content: center;
  }
  :global(a) {
    color: #147b50;
    font-weight: 500;
  }

  :global(button) {
    background-color: #147b50;
    border-color: #147b50;
  }

  :global(.button.button-outline, button.button-outline){
    border-color: #147b50;
    color: #147b50;
  }

  :global(input[type="radio"].toggle:checked+label){
    color: #147b50;
  }

  :global(input[type='text']:focus, textarea:focus, select:focus) {
    border-color: #147b50;
  }

  :global(input[type="radio"].toggle+label:after) {
    border-bottom-color: #147b50;
  }

  .container {
    max-width: 70%;
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

  footer {
    font-size: 1.2rem;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-wrap: wrap;
    margin: 2rem;
  }

  footer > * {
    margin-left: 1rem;
  }

  @media only screen and (max-width: 1250px) {
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
  <Navbar {segment}/>
  <div class="main">
    <Sidebar {cats}/>
    <div class="content">
      <main>
      	<slot></slot>
      </main>
      <footer>
        <a href="/leaderboard">Leaderboard</a>
        <a id="bookmarklet" href="#" title="Drag to bookmark bar">Bookmarklet</a>
        <a href="https://upvotocracy.com/api/1/posts/rss">RSS</a>
        <a href="mailto:hello@upvotocracy.com?subject=Upvotocracy">hello@upvotocracy.com</a>
        <a href="https://github.com/profullstack/reddit-clone-svelte" title="MIT">open source</a>
        <a href="https://www.facebook.com/pg/upvoGoCrazy/" title="Facebook: upvoGoCrazy">Facebook</a>
        <a href="https://nullvideo.com">nullvideo.com</a>
        <a href="https://virusoutbreak.wtf">VirusOUTBREAK</a>
        <a href="https://theultimateprepper.com">The Ultimate Prepper</a>
        <a href="https://profullstack.com">Profullstack.com</a>
        <span class="legal">&copy; 2020</span>
      </footer>
    </div>
  </div>
</div>