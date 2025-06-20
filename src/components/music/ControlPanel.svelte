<script lang="ts">
  import type { Track } from "../../types/music";

  interface Props {
    currentTrack: Track | null;
    isMobile: boolean;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    onTogglePlay: () => void;
    onNext: () => void;
    onPrev: () => void;
    onSeek: (time: number) => void;
  }

  const {
    currentTrack,
    isMobile,
    isPlaying,
    currentTime,
    duration,
    onTogglePlay,
    onNext,
    onPrev,
    onSeek,
  }: Props = $props();

  function formatTime(seconds: number): string {
    if (!isFinite(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function handleSeekInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const seekTime = (parseFloat(target.value) / 100) * duration;
    onSeek(seekTime);
  }

  const progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
</script>

<div class="control-panel {isMobile ? 'control-mobile' : 'control-desktop'}">
  {#if currentTrack}
    <div class="track-info">
      <div class="track-title">{currentTrack.title}</div>
      <div class="track-artist">{currentTrack.artist}</div>
    </div>
    <div class="controls">
      <button class="control-btn prev" onclick={onPrev} aria-label="前の曲">
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
        onclick={onTogglePlay}
        aria-label={isPlaying ? "一時停止" : "再生"}
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

      <button class="control-btn next" onclick={onNext} aria-label="次の曲">
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

    <div class="seek-container">
      <span class="time current-time">{formatTime(currentTime)}</span>
      <input
        type="range"
        class="seek-bar"
        min="0"
        max="100"
        value={progress}
        oninput={handleSeekInput}
        aria-label="シークバー"
      />
      <span class="time total-time">{formatTime(duration)}</span>
    </div>
  {:else}
    <div class="no-track">音楽が選択されていません</div>
  {/if}
</div>

<style lang="scss">
  .control-panel {
    background: rgba(54, 51, 51, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 20px;
    color: #f6e9e9;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(225, 100, 40, 0.3);

    .track-info {
      margin-bottom: 16px;
      text-align: center;

      .track-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
        color: #f6e9e9;
      }

      .track-artist {
        font-size: 14px;
        color: rgba(246, 233, 233, 0.7);
      }
    }

    .controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;

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
      }
    }

    .seek-container {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      .time {
        font-size: 12px;
        color: rgba(246, 233, 233, 0.7);
        min-width: 35px;
        text-align: center;
      }

      .seek-bar {
        flex: 1;
        height: 4px;
        background: rgba(246, 233, 233, 0.2);
        border-radius: 2px;
        outline: none;
        cursor: pointer;

        &::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #e16428;
          border-radius: 50%;
          cursor: pointer;
        }

        &::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #e16428;
          border-radius: 50%;
          border: none;
          cursor: pointer;
        }
      }
    }

    .no-track {
      text-align: center;
      color: rgba(246, 233, 233, 0.5);
      font-size: 14px;
    }

    // モバイル用のスタイル調整
    &.control-mobile {
      border-radius: 0;
      padding: 4px 16px;
      display: flex;
      align-items: center;
      gap: 12px;

      .track-info {
        margin-bottom: 0;
        text-align: left;
        flex: 1;
        min-width: 0;

        .track-title {
          font-size: 14px;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .track-artist {
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .controls {
        margin-bottom: 0;
        gap: 8px;

        .control-btn {
          padding: 6px;

          &.play-pause {
            padding: 8px;
          }
        }
      }

      .seek-container {
        display: none;
      }
    }
  }
</style>
