<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { AudioAnalyzer, WaveVisualizer } from "../../utils";

  interface Props {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    musicSrc?: string | null;
    audioElement?: HTMLAudioElement | null;
  }

  const { isPlaying, musicSrc = null, audioElement = null }: Props = $props();

  let isMobile = $state(false); // 内部で管理

  let audio: HTMLAudioElement | null = null;
  let canvas: HTMLCanvasElement;
  let audioAnalyzer: AudioAnalyzer | null = null;
  let waveVisualizer: WaveVisualizer | null = null;

  onMount(() => {
    // 初期のisMobile状態を設定
    isMobile = window.innerWidth < 768;

    if (canvas) {
      audioAnalyzer = new AudioAnalyzer();
      waveVisualizer = new WaveVisualizer(canvas, isMobile);
      waveVisualizer.updateCanvasSize();
    }

    // リサイズイベントをリッスン
    const handleResize = (event: Event) => {
      // イベントにisMobile情報が含まれている場合は、それを優先して使用
      const customEvent = event as CustomEvent;
      const eventIsMobile = customEvent.detail?.isMobile;
      if (eventIsMobile !== undefined) {
        isMobile = eventIsMobile; // 内部状態も更新
        waveVisualizer?.setMobile(eventIsMobile);
      }

      // DOM更新とCSS適用を待ってからキャンバスサイズを更新
      requestAnimationFrame(() => {
        setTimeout(() => {
          waveVisualizer?.updateCanvasSize();
        }, 10);
      });
    };

    document.addEventListener("wave-display-resize", handleResize);

    return () => {
      document.removeEventListener("wave-display-resize", handleResize);
    };
  });

  $effect(() => {
    if (musicSrc || audioElement) {
      initializeAudio();
    }
  });

  $effect(() => {
    if (isPlaying) {
      startVisualization();
    } else {
      stopVisualization();
    }
  });

  onDestroy(() => {
    cleanup();
  });

  function initializeAudio() {
    if (!musicSrc && !audioElement) {
      console.error("No audio source or element provided");
      return;
    }

    if (!audioAnalyzer) {
      console.error("AudioAnalyzer not initialized");
      return;
    }

    try {
      if (audioElement) {
        audio = audioElement;
        // console.log("Using provided audio element");
      } else {
        audio = new Audio(musicSrc!);
        audio.crossOrigin = "anonymous";
        // console.log("Created new audio element with src:", musicSrc);
      }

      audioAnalyzer.initialize(audio);
    } catch (error) {
      console.error("Audio initialization failed:", error);
    }
  }

  function startVisualization() {
    // console.log("Starting visualization, isPlaying:", isPlaying);

    if (!audioAnalyzer?.isReady() || !waveVisualizer) {
      console.error("Missing required components for visualization:", {
        audioAnalyzer: !!audioAnalyzer?.isReady(),
        waveVisualizer: !!waveVisualizer,
      });
      return;
    }

    const getFrequencyData = () => {
      if (!isPlaying) return null;
      return audioAnalyzer!.getFrequencyData();
    };

    waveVisualizer.startVisualization(
      getFrequencyData,
      audioAnalyzer.getBufferLength(),
    );
  }

  function stopVisualization() {
    waveVisualizer?.stopVisualization();
  }

  function cleanup() {
    waveVisualizer?.cleanup();
    audioAnalyzer?.cleanup();

    // audioElementが外部から渡されている場合は削除しない
    if (audio && !audioElement) {
      audio.pause();
      audio = null;
    } else {
      audio = null;
    }

    audioAnalyzer = null;
    waveVisualizer = null;
  }
</script>

<div class="wave-display {isMobile ? 'mobile' : 'desktop'}">
  <div class="wave-container">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>

<style lang="scss">
  .wave-display {
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;

    .wave-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end; // 下端に配置
      justify-content: center;
      position: relative;
      margin: 0;
      padding: 0;

      canvas {
        width: 100%;
        height: 100%;
        max-height: 100px;
        display: block; // inline要素のデフォルトマージンを除去
        margin: 0;
        padding: 0;
      }
    }

    &.desktop {
      bottom: 0;
      height: 70px;
      align-items: flex-end; // 下端に配置

      .wave-container {
        align-items: flex-end; // 画面下端にぴったり
        justify-content: stretch; // 幅いっぱい

        canvas {
          margin-bottom: 0; // 下マージンを確実に0に
          height: 100%;
          max-height: none; // デスクトップでは高さ制限を外す
        }
      }
    }

    &.mobile {
      top: 0;
      right: 0;
      width: 70px;
      height: calc(
        100dvh - var(--mobile-control-height) * (1 - var(--mobile-expanded, 0))
      );
      align-items: center;
      justify-content: center;

      .wave-container {
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        max-height: 100%; // 親要素の高さを超えないように制限
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(180deg);
        transform-origin: center;
        overflow: hidden;

        canvas {
          width: 100%;
          height: 100%;
          max-height: none;
          max-width: none;
        }
      }
    }
  }
</style>
