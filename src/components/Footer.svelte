<script>
  import { onMount } from 'svelte';
  onMount(() => {
    document
      .getElementById('bookmarklet')
      .setAttribute(
        'href',
        "javascript:void(open(`SITE_URL/compose?link=${encodeURIComponent(`${location.href}${location.href.includes('?')?'&':'?'}_snoorandom=${crypto.getRandomValues(new Uint8Array(4)).reduce((a,v)=>a+=(v.toString(16).padStart(2,'0')),'')}`)}&title=${encodeURIComponent(document.querySelector('meta[name=title][content]')?document.querySelector('meta[name=title][content]').content:document.title)}`))",
      );
  });
</script>

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
    <span class="legal">&copy; 2023</span>
  </div>
  <div>
    <a href="https://t.me/Upvoto">Telegram: Upvoto</a>
    <a href="http://ONION_URL/">Tor: ONION_URL</a>
    <a href="https://discord.gg/VfGmeKn">Discord</a>
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
  </div>
</footer>

<style>
  footer {
    margin: 50px 0 20px 0;
  }
  footer > div {
    font-size: 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-wrap: wrap;
    margin: 0 2rem;
  }

  footer > div * {
    margin-left: 1rem;
  }
  a {
    color: var(--green-accent);
  }
</style>
