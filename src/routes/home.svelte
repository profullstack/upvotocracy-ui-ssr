<script context="module">
  export async function preload(page, session) {
    return { page };
  }
</script>

<script>
  import Home from "../components/Home.svelte";
  import { onMount } from "svelte";
  import { makeApiRequest, globalErrorHandler } from "../components/create-api";

  export let page;
  let morePosts;
  let posts;
  let sort;

  const fetchPage = async () => {
    let type;
    let pageNumber;
    let currentURL = new URLSearchParams(window.location.search);

    if (currentURL.get("page")) pageNumber = parseInt(currentURL.get("page"));
    else pageNumber = 0;

    if (page.query.sort) type = page.query.sort;

    if (type === "hot") {
      sort = "-rank";
    } else if (type === "top") {
      sort = "-score";
    } else if (type === "new") {
      sort = "-created";
    } else if (type === "comments") {
      sort = "comments";
    } else if (type === "not") {
      sort = "+score";
    }

    let url = `/subscriptions?sort=${sort}&page=${pageNumber}`;

    const res = await makeApiRequest(url, null, { method: "GET" }).catch(err =>
      globalErrorHandler(err)
    );

    if (!res) return;

    posts = res.posts;
    morePosts = res.more;

    return { posts, page, morePosts, sort };
  };

  onMount(async () => {
    fetchPage();
  });

  $: if (typeof window != "undefined") fetchPage(page.query);
</script>

<svelte:head>
  <title>SITE_DESCRIPTION</title>
</svelte:head>

<Home {posts} {page} {morePosts} {sort} subscriptions={true} />
