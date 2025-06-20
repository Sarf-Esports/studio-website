<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  interface Props {
    isMobile: boolean;
    resizeKey: number;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    musicSrc?: string | null;
    audioElement?: HTMLAudioElement | null;
  }

  const {
    isMobile,
    resizeKey,
    isPlaying,
    musicSrc = null,
    audioElement = null,
  }: Props = $props();

  let audioContext: AudioContext | null = null;
  let audio: HTMLAudioElement | null = null;
  let analyser: AnalyserNode | null = null;
  let source: MediaElementAudioSourceNode | null = null;
  let gainNode: GainNode | null = null;
  let dataArray: Uint8Array | null = null;
  let bufferLength = 0;
  let animationId: number | null = null;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let currentAudioElement: HTMLAudioElement | null = null; // 現在接続されているaudio要素を追跡

  onMount(() => {
    if (canvas) {
      ctx = canvas.getContext("2d");
      updateCanvasSize();
    }
  });

  // 親コンポーネントからのリサイズ通知を監視
  $effect(() => {
    if (resizeKey > 0) {
      updateCanvasSize();
    }
  });

  function updateCanvasSize() {
    if (!canvas || !ctx) return;

    const container = canvas.parentElement!;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.scale(dpr, dpr);

    console.log(
      `WaveDisplay resized (${isMobile ? "mobile" : "desktop"}): ${rect.width} x ${rect.height}`,
    );
    console.log(
      `Canvas resized (${isMobile ? "mobile" : "desktop"}): ${canvas.width} x ${canvas.height}`,
    );
  }

  $effect(() => {
    if (musicSrc || audioElement) {
      // audio要素が変更された場合は既存の接続をクリア
      if (currentAudioElement && currentAudioElement !== audioElement) {
        console.log("Audio element changed, cleaning up...");
        cleanup();
      }
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

  // グローバルなAudioContextを管理
  let globalAudioContext: AudioContext | null = null;

  function getAudioContext(): AudioContext {
    if (!globalAudioContext) {
      globalAudioContext = new AudioContext();
    }
    return globalAudioContext;
  }

  function initializeAudio() {
    if (!musicSrc && !audioElement) {
      console.log("No audio source or element provided");
      return;
    }

    // 現在のaudio要素と同じで、既にsourceが存在する場合はスキップ
    if (source && currentAudioElement === audioElement) {
      console.log("Audio already initialized for this element, skipping");
      return;
    }

    try {
      audioContext = getAudioContext();
      console.log("Using AudioContext:", audioContext.state);

      if (audioElement) {
        audio = audioElement;
        console.log("Using provided audio element");
      } else {
        audio = new Audio(musicSrc!);
        audio.crossOrigin = "anonymous";
        console.log("Created new audio element with src:", musicSrc);
      }

      // 現在のaudio要素と異なる場合、または初回の場合のみソースを作成
      if (currentAudioElement !== audio || !source) {
        if (source) {
          source.disconnect();
          source = null;
        }

        source = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        gainNode = audioContext.createGain();

        analyser.fftSize = 512;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.value = 0.08;

        // 現在のaudio要素を記録
        currentAudioElement = audio;

        console.log("Audio nodes initialized successfully");
      }
    } catch (error: any) {
      console.error("Audio initialization failed:", error);
      // MediaElementAudioSourceNodeが既に作成されている場合のエラーを処理
      if (error?.name === "InvalidStateError") {
        console.log(
          "Audio source already exists for this element - this should not happen with our tracking",
        );
      }
    }
  }

  function startVisualization() {
    console.log("Starting visualization, isPlaying:", isPlaying);

    if (!analyser || !dataArray || !ctx || !canvas) {
      console.log("Missing required components for visualization:", {
        analyser: !!analyser,
        dataArray: !!dataArray,
        ctx: !!ctx,
        canvas: !!canvas,
      });
      return;
    }

    if (audioContext?.state === "suspended") {
      console.log("Resuming suspended audio context");
      audioContext.resume();
    }

    const drawSpectrum = () => {
      // 再生が停止されている場合は終了
      if (!isPlaying || !analyser || !ctx || !dataArray || !canvas) {
        console.log("Stopping visualization");
        animationId = null;
        return;
      }

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.width / dpr;
      const displayHeight = canvas.height / dpr;

      const barCount = bufferLength;

      for (let i = 0; i < barCount; i++) {
        const normalized = dataArray[i] / 255;

        const baseLength =
          Math.pow(normalized, 2.5) * 0.8 +
          Math.sin(normalized * Math.PI * 2) * 0.1;

        let gradient: CanvasGradient;
        let x: number, y: number, width: number, height: number;

        if (isMobile) {
          // モバイル: 縦向き波形描画
          const barHeight = displayHeight / barCount;
          const barWidth = baseLength * displayWidth;
          const finalWidth = Math.max(barWidth, 2);

          x = 0;
          y = i * barHeight;
          width = finalWidth;
          height = barHeight - 1;

          gradient = ctx.createLinearGradient(0, 0, finalWidth, 0);
        } else {
          // デスクトップ: 横向き波形描画
          const barWidth = displayWidth / barCount;
          const barHeight = baseLength * displayHeight;
          const finalHeight = Math.max(barHeight, 2);

          x = i * barWidth;
          y = displayHeight - finalHeight;
          width = barWidth - 1;
          height = finalHeight;

          gradient = ctx.createLinearGradient(
            0,
            displayHeight - finalHeight,
            0,
            displayHeight,
          );
        }

        gradient.addColorStop(0, "rgba(240, 183, 77, 0.9)");
        gradient.addColorStop(1, "rgba(225, 100, 40, 0.9)");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);
      }

      animationId = requestAnimationFrame(drawSpectrum);
    };

    drawSpectrum();
  }

  function stopVisualization() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function cleanup() {
    stopVisualization();

    source?.disconnect();
    source = null;

    analyser?.disconnect();
    analyser = null;

    gainNode?.disconnect();
    gainNode = null;

    // グローバルAudioContextは閉じない（他のコンポーネントで使用される可能性があるため）
    audioContext = null;

    // audioElementが外部から渡されている場合は削除しない
    if (audio && !audioElement) {
      audio.pause();
      audio = null;
    } else {
      audio = null;
    }

    currentAudioElement = null;
    dataArray = null;
    bufferLength = 0;
  }
</script>

<div class="wave-display {isMobile ? 'wave-mobile' : 'wave-desktop'}">
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

    &.wave-desktop {
      height: 100%;
      display: flex;
      align-items: flex-end; // 下端に配置
    }

    &.wave-mobile {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

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

    &.wave-desktop {
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

    &.wave-mobile {
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
