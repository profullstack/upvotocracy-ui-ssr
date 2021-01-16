<script>
  export let toggleOn = false;
</script>

<div on:click={() => (toggleOn = !toggleOn)} class="hide-nsfw" class:toggleOn>
  <svg width="28" height="16" viewBox="0 0 28 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="0.5"
      y="0.5"
      width="27"
      height="15"
      rx="7.5"
      stroke={toggleOn ? 'var(--green-accent)' : 'var(--text-color)'}
    />
    <rect
      x={toggleOn ? '15' : '3'}
      y="3"
      width="10"
      height="10"
      rx="5"
      fill={toggleOn ? 'var(--green-accent)' : 'var(--text-color)'}
    />
  </svg>
  Hide NSFW
</div>

<style>
  .hide-nsfw {
    color: var(--text-color);
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
  }
  .toggleOn {
    color: var(--green-accent);
  }
  svg {
    vertical-align: sub;
  }
</style>
