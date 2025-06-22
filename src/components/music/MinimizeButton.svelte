<script lang="ts">
  interface Props {
    isMinimized: boolean;
    onclick: () => void;
  }
  const { isMinimized, onclick }: Props = $props();
</script>

{#if isMinimized}
  <button
    class="minimized-button"
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
      class="bi bi-music-player-fill"
      viewBox="0 0 16 16"
    >
      <path d="M8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
      <path
        d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm1 2h6a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1m3 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6"
      />
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

  .minimized-button {
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
    }
  }
</style>
