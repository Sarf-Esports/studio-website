<script lang="ts">
  import { onMount } from "svelte";
  import type { Track, PlayerState } from "../../types/music";
  import ControlPanel from "./ControlPanel.svelte";
  import WaveDisplay from "./WaveDisplay.svelte";

  const tracks: Track[] = [
    {
      title: "BACK ONCE AGAIN",
      artist: "chris_gangcat",
      src: "/music/back-once-again.mp3",
    },
    {
      title: "Kill it [ABYSSUM EP VOL.2]",
      artist: "chris_gangcat",
      src: "/music/kill-it.mp3",
    },
  ];

  // 音楽プレイヤーの状態
  let playerState = $state<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playlist: tracks,
    currentIndex: 0,
  });

  let audioElement = $state<HTMLAudioElement>();
  let isMobile = $state(false);

  onMount(() => {
    const updateWindowSize = () => {
      isMobile = window.innerWidth < 768;
      // 通常のwindowリサイズをWaveDisplayに通知（最新のisMobile状態も含める）
      const resizeEvent = new CustomEvent("wave-display-resize", {
        detail: { type: "window", isMobile },
      });
      document.dispatchEvent(resizeEvent);
    };

    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);

    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  });

  // プレイリストが変更されたら更新
  $effect(() => {
    playerState.playlist = tracks;
    if (tracks.length > 0 && !playerState.currentTrack) {
      playerState.currentTrack = tracks[0];
    }
  });

  // 現在のトラックが変更されたときの処理
  $effect(() => {
    if (playerState.currentTrack && audioElement) {
      // console.log("Current track changed to:", playerState.currentTrack.title);
    }
  });

  // 音楽再生・一時停止
  function togglePlay() {
    if (!audioElement || !playerState.currentTrack) return;

    if (playerState.isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function play() {
    if (!audioElement) return;
    audioElement
      .play()
      .then(() => {
        playerState.isPlaying = true;
        // console.log("再生開始:", playerState.currentTrack?.title);
      })
      .catch((error) => {
        console.error("再生に失敗しました:", error);
        playerState.isPlaying = false;
      });
  }

  function pause() {
    if (!audioElement) return;
    audioElement.pause();
    playerState.isPlaying = false;
    // console.log("再生停止:", playerState.currentTrack?.title);
  }

  function nextTrack() {
    if (playerState.playlist.length === 0) return;

    const nextIndex =
      (playerState.currentIndex + 1) % playerState.playlist.length;
    changeTrack(nextIndex);
  }

  function prevTrack() {
    if (playerState.playlist.length === 0) return;

    const prevIndex =
      playerState.currentIndex === 0
        ? playerState.playlist.length - 1
        : playerState.currentIndex - 1;
    changeTrack(prevIndex);
  }

  function changeTrack(index: number) {
    if (index < 0 || index >= playerState.playlist.length) return;

    const wasPlaying = playerState.isPlaying;

    // 現在の再生を停止
    if (audioElement) {
      audioElement.pause();
    }

    playerState.currentIndex = index;
    playerState.currentTrack = playerState.playlist[index];
    playerState.currentTime = 0;
    playerState.duration = 0;
    playerState.isPlaying = false;

    // 新しいトラックが読み込まれたら再生開始
    if (wasPlaying) {
      // 少し待ってから再生開始（audio要素のsrc変更を待つ）
      setTimeout(() => {
        if (audioElement && audioElement.src) {
          audioElement
            .play()
            .then(() => {
              playerState.isPlaying = true;
            })
            .catch((error) => {
              console.error("再生に失敗しました:", error);
              playerState.isPlaying = false;
            });
        }
      }, 200);
    }
  }

  function seek(time: number) {
    if (!audioElement) return;
    audioElement.currentTime = time;
    playerState.currentTime = time;
  }

  function handleTimeUpdate() {
    if (audioElement) {
      playerState.currentTime = audioElement.currentTime;
    }
  }

  function handleLoadedMetadata() {
    if (audioElement) {
      playerState.duration = audioElement.duration;
      // console.log("メタデータ読み込み完了:", playerState.currentTrack?.title);
    }
  }

  function handleEnded() {
    nextTrack();
  }

  function handleError() {
    console.error("音楽ファイルの読み込みに失敗しました");
    playerState.isPlaying = false;
  }
</script>

{#if playerState.currentTrack}
  <audio
    bind:this={audioElement}
    src={playerState.currentTrack.src}
    ontimeupdate={handleTimeUpdate}
    onloadedmetadata={handleLoadedMetadata}
    onended={handleEnded}
    onerror={handleError}
    preload="metadata"
  ></audio>
{/if}

<div class="music-player {isMobile ? 'mobile' : 'desktop'}">
  <WaveDisplay
    isPlaying={playerState.isPlaying}
    currentTime={playerState.currentTime}
    duration={playerState.duration}
    musicSrc={playerState.currentTrack?.src}
    {audioElement}
  />

  <ControlPanel
    {isMobile}
    currentTrack={playerState.currentTrack}
    isPlaying={playerState.isPlaying}
    currentTime={playerState.currentTime}
    duration={playerState.duration}
    onTogglePlay={togglePlay}
    onNext={nextTrack}
    onPrev={prevTrack}
    onSeek={seek}
  />
</div>

<style lang="scss">
  :root {
    --mobile-control-height: 75px;
  }

  .music-player {
    position: fixed;
    pointer-events: none;
    inset: 0;
  }
</style>
