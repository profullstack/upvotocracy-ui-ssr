<script>
  import moment from 'moment';
  import { goto } from '@sapper/app';
  import { userStore } from '../store';
  import { makeApiRequest, globalErrorHandler } from '../api/create-api';
  import showdown from 'showdown';
  import VoteArrow from './VoteArrow.svelte';
  import CommentList from './Comments/CommentList.svelte';
  import SortBar from './SortBar.svelte';
  import { onMount } from 'svelte';
  const converter = new showdown.Converter({ simplifiedAutoLink: true });

  export let post = {};
  export let withDetails = false;
  let postThumb = null;
  let postVideo = null;
  let youtubeId = null;
  let nullvideo = null;
  let userVote = null;

  const getThumb = (post) => {
    if (post.url && /\.(jpg|jpeg|png|gif)/.test(post.url.toLowerCase())) {
      postThumb = post.url;
    } else {
      postThumb = post.thumb;
    }

    postThumb = postThumb && postThumb.replace('http://', 'https://');
  };

  const getVideo = (post) => {
    if (post.url) {
      if (post.url.indexOf('youtube.com') > -1) {
        youtubeId = post.url.match(/v=([^&]*)/);
        postVideo = post.url;
      } else if (post.url.indexOf('youtu.be') > -1) {
        youtubeId = post.url.match(/youtu.be\/([^&\?]*)/);
        postVideo = post.url;
      } else if (post.url.indexOf('skip.nullvideo') > -1) {
        postVideo = post.url.replace('/user/', '/uploads/') + '.mp4';
        postVideo = postVideo.replace(/(\?.*)/, '.mp4$1');
        nullvideo = postVideo;
      } else if (post.url.indexOf('streamable') > -1) {
        // https://cdn-b-east.streamable.com/video/mp4/3xa346.mp4?token=yGGZHgB2v7JOlzbwcJaMkw&expires=1587257340
        postVideo = post.url.replace('/user/', '/uploads/') + '.mp4';
        postVideo = postVideo.replace(/(\?.*)/, '.mp4$1');
        nullvideo = postVideo;
      } else if (/\.(mp4|mov|m3u8)/.test(post.url.toLowerCase())) {
        postVideo = post.url;
      } else {
        youtubeId = null;
        postVideo = null;
      }
    }
  };

  const getUserVote = () => {
    const vote = post.votes.filter((vote) => vote.user == user.id);

    if (vote[0]) {
      if (vote[0].vote == -1) userVote = 'downvote';
      else if (vote[0].vote == 1) userVote = 'upvote';
    }
  };

  function share(name, script) {
    const el = document.querySelector(`.share ${name}`);

    if (!el) return;

    el.setAttribute('href', script);
  }

  $: {
    getThumb(post);
    getVideo(post);
    getUserVote(post);
  }

  let user = {};
  userStore.subscribe((value) => {
    if (value) user = value;
  });

  const vote = async (state) => {
    const url = `/post/${post.id}/${state}`;
    const data = await makeApiRequest(url, null, { method: 'GET' }).catch((err) =>
      globalErrorHandler(err),
    );

    if (!data) return;

    post.score = data.score;
    post.upvotePercentage = data.upvotePercentage;
    post.votes = data.votes;
  };

  const upvote = () => vote('upvote');
  const downvote = () => vote('downvote');

  const removePost = async () => {
    const url = `/post/${post.id}`;

    const res = await makeApiRequest(url, null, { method: 'DELETE' }).catch((err) =>
      globalErrorHandler(err),
    );

    if (res.message !== 'success') return globalErrorHandler('error deleting post');
    return goto('/');
  };

  onMount(() => {
    share(
      '.twitter',
      "javascript:(async () => {const title = encodeURIComponent(document.title); const url = encodeURIComponent(window.location.href); window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank'); })();",
    );

    share(
      '.ruqqus',
      "javascript:(async () => {const title = document.title; const url = window.location.href; window.open(`https://www.ruqqus.com/submit?guild=news&url=${url}`, '_blank'); })();",
    );

    share(
      '.upvotocracy',
      "javascript:void(open(`https://upvotocracy.com/compose?link=${encodeURIComponent(`${location.href}${location.href.includes('?')?'&':'?'}_snoorandom=${crypto.getRandomValues(new Uint8Array(4)).reduce((a,v)=>a+=(v.toString(16).padStart(2,'0')),'')}`)}&title=${encodeURIComponent(document.querySelector('meta[name=title][content]')?document.querySelector('meta[name=title][content]').content:document.title)}`))",
    );

    share(
      '.reddit',
      "javascript:(async () => {const title = encodeURIComponent(document.title); const url = encodeURIComponent(window.location.href); window.open(`https://www.reddit.com/submit?url=${url}&title=${title}`, '_blank'); })();",
    );

    share(
      '.bitcoinlatte',
      "javascript:void(open(`https://bitcoinlatte.com/compose?link=${encodeURIComponent(`${location.href}${location.href.includes('?')?'&':'?'}_snoorandom=${crypto.getRandomValues(new Uint8Array(4)).reduce((a,v)=>a+=(v.toString(16).padStart(2,'0')),'')}`)}&title=${encodeURIComponent(document.querySelector('meta[name=title][content]')?document.querySelector('meta[name=title][content]').content:document.title)}`))",
    );

    share(
      '.hackernews',
      "javascript:(async () => {const title = encodeURIComponent(document.title); const url = encodeURIComponent(window.location.href); window.open(`https://news.ycombinator.com/submitlink?u=${url}&t=${title}`, '_blank'); })();",
    );

    share(
      '.facebook',
      "javascript:(async () => {open('https://www.facebook.com/sharer.php?src=bm&v=4&i=1301235609&u='+encodeURIComponent(window.location.href)+'&t='+encodeURIComponent(document.title), '_blank') })();",
    );
  });
</script>

<div class="container">
  {#if withDetails}
    <SortBar showHome={true} category={post.category.name} />
  {/if}
  <div class="post-outer-container">
    <div class="score">
      <VoteArrow type="up" click={upvote} selected={userVote == 'upvote'} />
      {post.score}
      <VoteArrow type="down" click={downvote} selected={userVote == 'downvote'} />
    </div>
    <div class:sponsored={post.sponsored} class="post-inner-container">
      {#if (postThumb && !withDetails) || (postThumb && withDetails && !postVideo)}
        <div class="post-thumb" style={`background-image: url(${postThumb})`} />
      {/if}
      {#if withDetails}
        {#if postVideo}
          {#if youtubeId && youtubeId[1]}
            <div class="plyr__video-embed youtube">
              <iframe
                style="border: none;"
                src={`https://www.youtube.com/embed/${youtubeId[1]}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`}
                allowfullscreen
                allowtransparency
                title="YouTube"
              />
            </div>
          {:else if nullvideo}
            <video
              class="mp4"
              poster={nullvideo.replace('.mp4', '.png')}
              id={`vid-${new Date().getTime()}`}
              playsinline
              controls
              crossorigin
            >
              <source src={nullvideo} type="video/mp4" />
            </video>
          {:else if post.type == 'media'}
            <video
              class="mp4"
              poster={postThumb}
              id={`vid-${new Date().getTime()}`}
              playsinline
              controls
              crossorigin
            >
              <source src={postVideo} type="video/mp4" />
            </video>
          {:else}
            <video
              class="mp4"
              poster={postVideo.replace('.mp4', '.png')}
              id={`vid-${new Date().getTime()}`}
              playsinline
              controls
              crossorigin
            >
              <source src={postVideo} type="video/mp4" />
            </video>
          {/if}
        {:else}
          <a class="title title-above" rel="prefetch" href={`/a/${post.category.name}/${post.id}`}
            >{post.title}</a
          >
          <p class="text">
            {#if post.url}
              <a href={post.url} target="_blank">{@html post.url}</a>
            {:else}
              {@html converter.makeHtml(post.text)}
            {/if}
          </p>
        {/if}
      {/if}
      <div class="post-info">
        {#if !withDetails || postVideo}
          <a class="title" rel="prefetch" href={`/a/${post.category.name}/${post.id}`}
            >{post.title}</a
          >
        {/if}
        <div class="lower">
          <div class="lower-left">
            <a class="category-link" href={`/a/${post.category.name}`}>/a/{post.category.name}</a>
            <a href={`/u/${post.author.username}`} class="by-username"
              >by <span class="username">{post.author.username}</span></a
            >
          </div>
          <div class="lower-right">
            <a rel="prefetch" href={`/a/${post.category.name}/${post.id}`} class="comment-count">
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 14C12.418 14 16 10.866 16 7C16 3.134 12.418 0 8 0C3.582 0 0 3.134 0 7C0 8.76 0.743 10.37 1.97 11.6C1.873 12.616 1.553 13.73 1.199 14.566C1.12 14.752 1.273 14.96 1.472 14.928C3.728 14.558 5.069 13.99 5.652 13.694C6.41791 13.8983 7.20732 14.0012 8 14Z"
                />
              </svg>
              {post.comments.length} comments
            </a>
            <span class="date">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346627 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C16 6.94942 15.7931 5.90914 15.391 4.93853C14.989 3.96793 14.3997 3.08601 13.6569 2.34315C12.914 1.60028 12.0321 1.011 11.0615 0.608964C10.0909 0.206926 9.05058 0 8 0ZM11.2 8.8H8C7.78783 8.8 7.58435 8.71571 7.43432 8.56568C7.28429 8.41565 7.2 8.21217 7.2 8V4.8C7.2 4.58783 7.28429 4.38434 7.43432 4.23431C7.58435 4.08428 7.78783 4 8 4C8.21218 4 8.41566 4.08428 8.56569 4.23431C8.71572 4.38434 8.8 4.58783 8.8 4.8V7.2H11.2C11.4122 7.2 11.6157 7.28428 11.7657 7.43431C11.9157 7.58434 12 7.78782 12 8C12 8.21217 11.9157 8.41565 11.7657 8.56568C11.6157 8.71571 11.4122 8.8 11.2 8.8Z"
                />
              </svg>
              {moment(post.created).fromNow()}
            </span>
            <span>{post.views} views</span>
            {#if post.sponsored}
              <a rel="prefetch" href="/sponsor" class="sponsored-txt">sponsored</a>
            {/if}
          </div>
        </div>
        {#if withDetails}
          <div class="share">
            <strong>Share:</strong>
            <a href="#" class="twitter">twitter</a>
            <a href="#" class="ruqqus">ruqqus</a>
            <a href="#" class="reddit">reddit</a>
            <a href="#" class="upvotocracy">upvotocracy</a>
            <a href="#" class="hackernews">hackernews</a>
            <a href="#" class="bitcoinlatte">bitcoinlatte</a>
            <a href="#" class="facebook">facebook</a>
          </div>
        {/if}
      </div>
      {#if withDetails && (post.author.id === user.id || user.admin)}
        <div class="sponsor-delete">
          {#if !post.sponsored}
            <a class="sponsor-this" href={`/sponsor?postId=${post.id}`}>sponsor this post</a>
          {/if}
          <a href="javascript:void(0)" class="remove-button" on:click={removePost}>delete</a>
        </div>
      {/if}
    </div>
  </div>
  {#if withDetails}
    <CommentList {post} />
  {/if}
</div>

<style>
  .sponsor-delete {
    margin: 7px 14px;
    display: flex;
    justify-content: space-between;
  }
  .sponsor-delete > a {
    font-size: 15px;
    color: var(--green-accent);
  }
  .title-above {
    margin: 0 10px;
  }
  .sponsored {
    border: 1px solid var(--green-accent) !important;
  }
  .sponsored-txt {
    font-size: small;
    margin-left: 5px;
    color: var(--green-accent);
  }
  .container {
    max-width: 750px;
    flex-grow: 1;
    padding: 0 15px;
  }
  .post-outer-container {
    display: flex;
    margin: 10px 0;
  }
  .post-inner-container {
    background: var(--bg);
    border: 3px solid var(--sidebar-bg);
    box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    width: 100%;
  }
  .post-info {
    margin: 15px;
  }
  .lower {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    font-size: 14px;
  }
  .lower-right > * {
    margin-right: 1vw;
  }
  .category-link {
    font-weight: bold;
    color: var(--green-accent);
  }
  .by-username {
    margin-left: 1vw;
    color: #666666;
  }
  .username {
    font-weight: 700;
    color: var(--text-color);
  }
  .comment-count {
    margin-right: 1vw;
    font-weight: 700;
  }
  .post-thumb {
    height: 280px;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    border-radius: 5px;
  }
  .score {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30px;
    height: 51px;
    justify-content: space-between;
    font-weight: bold;
    font-size: 15px;
  }
  .title {
    display: block;
    font-weight: bold;
    font-size: 19px;
    line-height: 26px;
    margin-block-start: 1em;
    margin-block-end: 1em;
  }
  .text {
    word-break: break-all;
    margin: 10px;
  }
  svg {
    vertical-align: middle;
    fill: var(--text-color);
  }

  .share {
    margin: 1rem 0;
  }

  .share a {
    text-transform: capitalize;
    color: var(--green-accent);
    margin-right: 0.5rem;
  }

  video,
  .youtube,
  iframe {
    width: 100%;
    height: 300px;
    border-radius: 5px;
  }
</style>
