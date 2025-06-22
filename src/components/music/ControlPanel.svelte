<script lang="ts">
  import type { Track } from "../../types/music";
  import TrackInfo from "./TrackInfo.svelte";
  import PlaybackControls from "./PlaybackControls.svelte";
  import SeekBar from "./SeekBar.svelte";
  import MinimizeButton from "./MinimizeButton.svelte";
  import MobileProgressBar from "./MobileProgressBar.svelte";

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

  let isMinimized = $state(false);

  function handleMinimize() {
    isMinimized = !isMinimized;
  }
</script>

{#if !isMobile && isMinimized}
  <MinimizeButton {isMinimized} onclick={handleMinimize} />
{/if}

{#if isMobile || !isMinimized}
  <div class="control-panel {isMobile ? 'mobile' : 'desktop'}">
    {#if !isMobile && !isMinimized}
      <MinimizeButton {isMinimized} onclick={handleMinimize} />
    {/if}

    <TrackInfo {currentTrack} {isMobile} />

    <PlaybackControls
      {currentTrack}
      {isPlaying}
      {isMobile}
      {onTogglePlay}
      {onNext}
      {onPrev}
    />

    {#if !isMobile}
      <SeekBar {currentTime} {duration} {currentTrack} {onSeek} />
    {/if}
  </div>
{/if}

{#if currentTrack && isMobile}
  <MobileProgressBar {currentTime} {duration} />
{/if}

<style lang="scss">
  .control-panel {
    background: rgba(54, 51, 51, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 24px;
    color: #f6e9e9;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(225, 100, 40, 0.3);

    &.desktop {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 360px;
      pointer-events: auto;
    }

    &.mobile {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 75px;
      max-height: 75px;
      pointer-events: auto;
      border-radius: 0;
      padding: 4px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-sizing: border-box;
    }
  }
</style>
