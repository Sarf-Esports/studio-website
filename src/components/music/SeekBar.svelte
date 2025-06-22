<script lang="ts">
  import type { Track } from "../../types/music";

  interface Props {
    currentTime: number;
    duration: number;
    currentTrack: Track | null;
    onSeek: (time: number) => void;
  }
  const { currentTime, duration, currentTrack, onSeek }: Props = $props();

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

<div class="seek-container">
  <span class="time current-time">{formatTime(currentTime)}</span>
  <input
    type="range"
    class="seek-bar {currentTrack ? '' : 'disabled'}"
    min="0"
    max="100"
    value={progress}
    oninput={handleSeekInput}
    aria-label="シークバー"
    disabled={!currentTrack}
  />
  <span class="time total-time">{formatTime(duration)}</span>
</div>

<style lang="scss">
  .seek-container {
    display: flex;
    align-items: center;
    gap: 12px;

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

      &.disabled {
        cursor: not-allowed;
        background: rgba(246, 233, 233, 0.1);

        &::-webkit-slider-thumb,
        &::-moz-range-thumb {
          background: rgba(246, 233, 233, 0.3);
        }
      }
    }
  }
</style>
