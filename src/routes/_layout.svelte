<script context="module">
  export async function preload(page, session) {
    const res = await this.fetch(`API_BASE_URL/category`);
    const article = await res.json();
    const cats = article;
    return { cats };
  }
</script>

<script>
  import CategoriesBar from '../components/CategoriesBar/CategoriesBar.svelte';
  import TopBar from '../components/TopBar/TopBar.svelte';
  import { darkTheme, userStore, categories } from '../store';
  import { onMount } from 'svelte';
  import { makeApiRequest, globalErrorHandler } from '../api/create-api';
  import NotificationsBar from '../components/NotificationsBar/NotificationsBar.svelte';
  import GoogleAnalytics from 'sapper-google-analytics/GoogleAnalytics.svelte';
  import { stores } from '@sapper/app';
  import ErrorDropdown from '../components/ErrorDropdown.svelte';

  export let cats;
  let ga_measurment_id = 'GOOGLE_ANALYTICS'; // your analytics id
  let dark;
  darkTheme.subscribe((val) => (dark = val));

  let user;
  userStore.subscribe((val) => (user = val));

  categories.set(cats);

  const fetchMe = async () => {
    if (!user) return;
    const me = await makeApiRequest('/me', null, { method: 'GET' }).catch((err) =>
      globalErrorHandler(err),
    );

    if (!me) return;

    userStore.set(me);
  };

  onMount(async () => {
    fetchMe();
  });
</script>

<div class="main-container" data-theme={dark ? 'dark' : 'light'}>
  <ErrorDropdown />
  <TopBar />
  <div class="content">
    <CategoriesBar />
    <div class="center">
      <slot />
    </div>
    <NotificationsBar />
  </div>
  <GoogleAnalytics {stores} id={ga_measurment_id} />
</div>

<style>
  .main-container {
    background-color: var(--bg);
    min-height: 100vh;
  }
  .content {
    display: flex;
  }
  .center {
    display: flex;
    flex-grow: 1;
    justify-content: center;
  }
  .theme-toggle-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background-color: var(--bg);
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    z-index: 4;
  }
</style>
