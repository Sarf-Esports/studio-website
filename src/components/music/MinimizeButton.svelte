<script lang="ts">
  interface Props {
    isMinimized: boolean;
    onclick: () => void;
  }
  const { isMinimized, onclick }: Props = $props();
</script>

{#if isMinimized}
  <button
    class="minimized-btn"
    {onclick}
    onkeydown={(e) => e.key === "Enter" && onclick()}
    aria-label="プレイヤーを開く"
    type="button"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-music-note-beamed"
      viewBox="0 0 16 16"
    >
      <path
        d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2"
      />
      <path fill-rule="evenodd" d="M14 11V2h1v9zM6 3v10H5V3z" />
      <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z" />
    </svg>
  </button>
{:else}
  <button
    class="minimize-btn"
    {onclick}
    onkeydown={(e) => e.key === "Enter" && onclick()}
    aria-label="最小化"
    type="button"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-dash"
      viewBox="0 0 16 16"
    >
      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
    </svg>
  </button>
{/if}

<style lang="scss">
  .minimize-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(246, 233, 233, 0.1);
    border: 1px solid rgba(246, 233, 233, 0.2);
    color: rgba(246, 233, 233, 0.8);
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    z-index: 1002;

    &:hover {
      color: #f6e9e9;
      background: rgba(246, 233, 233, 0.15);
      border-color: rgba(246, 233, 233, 0.3);
      transform: scale(1.05);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .minimized-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 64px;
    height: 64px;
    background: rgba(225, 100, 40, 0.95);
    border: 2px solid rgba(225, 100, 40, 0.7);
    border-radius: 50%;
    color: #f6e9e9;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    pointer-events: auto;

    &:hover {
      background: rgba(225, 100, 40, 1);
      border-color: rgba(225, 100, 40, 1);
      transform: scale(1.1);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
    }

    &:active {
      transform: scale(0.95);
    }

    svg {
      width: 28px;
      height: 28px;
      transform: translateX(-1.5px);
    }
  }
</style>
