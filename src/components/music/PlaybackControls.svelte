<script lang="ts">
  import type { Track } from "../../types/music";
  interface Props {
    currentTrack: Track | null;
    isPlaying: boolean;
    isMobile: boolean;
    isMobileExpanded: boolean;
    onTogglePlay: () => void;
    onNext: () => void;
    onPrev: () => void;
  }
  const {
    currentTrack,
    isPlaying,
    isMobile,
    isMobileExpanded,
    onTogglePlay,
    onNext,
    onPrev,
  }: Props = $props();

  let expanded = $derived(isMobile && isMobileExpanded);

  // モバイルのexpandボタンとの干渉を防止
  function handleClick(callback: () => void) {
    return (event: MouseEvent) => {
      event.stopPropagation();
      callback();
    };
  }
</script>

<div class="controls {isMobile ? 'mobile' : 'desktop'}" class:expanded>
  <button
    class="control-btn prev"
    class:disabled={!currentTrack}
    class:expanded
    onclick={handleClick(onPrev)}
    aria-label="前の曲"
    disabled={!currentTrack}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-skip-start-fill"
      viewBox="0 0 16 16"
    >
      <path
        d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0z"
      />
    </svg>
  </button>
  <button
    class="control-btn play-pause"
    class:disabled={!currentTrack}
    class:expanded
    onclick={handleClick(onTogglePlay)}
    aria-label={isPlaying ? "一時停止" : "再生"}
    disabled={!currentTrack}
  >
    {#if isPlaying}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-pause-fill"
        viewBox="0 0 16 16"
      >
        <path
          d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"
        />
      </svg>
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-play-fill"
        viewBox="0 0 16 16"
        style="transform: translateX(1px);"
      >
        <path
          d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"
        />
      </svg>
    {/if}
  </button>
  <button
    class="control-btn next"
    class:disabled={!currentTrack}
    class:expanded
    onclick={handleClick(onNext)}
    aria-label="次の曲"
    disabled={!currentTrack}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-skip-end-fill"
      viewBox="0 0 16 16"
    >
      <path
        d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0z"
      />
    </svg>
  </button>
</div>

<style lang="scss">
  .controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;

    .control-btn {
      background: transparent;
      border: none;
      color: #f6e9e9;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        width: 32px;
        height: 32px;
      }

      &:hover {
        color: white;
        transform: scale(1.05);
      }

      &.play-pause {
        background-color: #e16428;

        svg {
          color: #f6e9e9;
        }

        &:hover {
          color: rgba(225, 100, 40, 0.8);
          transform: scale(1.05);
        }
      }

      &.disabled {
        color: rgba(246, 233, 233, 0.3);
        cursor: not-allowed;

        &:hover {
          transform: none;
        }
      }
    }

    &.desktop {
      margin-bottom: 16px;
    }

    &.mobile {
      gap: 8px;

      .control-btn {
        padding: 7px;

        &.play-pause {
          padding: 6px;
        }

        &.expanded {
          padding: 12px;

          svg {
            width: 40px;
            height: 40px;
          }

          &.play-pause {
            padding: 12px;
          }
        }
      }

      &.expanded {
        gap: 20px;
        margin-bottom: 16px;
      }
    }
  }
</style>
