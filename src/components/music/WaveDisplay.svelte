<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  interface Props {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    className?: string;
    musicSrc?: string | null;
    audioElement?: HTMLAudioElement | null;
  }
  const {
    isPlaying,
    currentTime,
    duration,
    className = "",
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

    // リサイズイベントリスナー
    const handleResize = () => {
      updateCanvasSize();
      console.log("Canvas resized to:", canvas.width, "x", canvas.height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  function updateCanvasSize() {
    if (!canvas) return;

    const container = canvas.parentElement;
    if (container) {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Canvas のサイズが変更されたら再描画
      if (ctx && isPlaying && analyser && dataArray) {
        // 次のフレームで再描画
        requestAnimationFrame(() => {
          if (!animationId && isPlaying) {
            startVisualization();
          }
        });
      }
    }
  }
  $effect(() => {
    if (musicSrc || audioElement) {
      console.log(
        "Effect triggered - musicSrc:",
        musicSrc,
        "audioElement:",
        !!audioElement,
      );
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
  }); // グローバルなAudioContextを管理
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

      // 既存のaudioElementを使用するか、新しく作成する
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
        // 既存のソースがあれば切断
        if (source) {
          source.disconnect();
          source = null;
        }

        // ノードの作成と接続
        source = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        gainNode = audioContext.createGain();

        // FFT設定
        analyser.fftSize = 512;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        // ノードチェーンの接続
        source.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // 初期音量設定
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

    // AudioContextが停止状態の場合は再開
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

      // データが存在するかチェック
      const hasData = dataArray.some((value) => value > 0);
      if (!hasData && Math.random() < 0.01) {
        // 1%の確率でログ出力
        console.log("No audio data detected");
      }

      // キャンバスをクリア
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 周波数スペクトラムを描画
      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const normalized = dataArray[i] / 255;
        const barHeight =
          Math.pow(normalized, 2.5) * canvas.height * 0.8 +
          Math.sin(normalized * Math.PI * 2) * canvas.height * 0.1;

        const finalHeight = Math.max(barHeight, 2);

        const gradient = ctx.createLinearGradient(
          0,
          canvas.height - finalHeight,
          0,
          canvas.height,
        );
        gradient.addColorStop(0, "rgba(240, 183, 77, 0.9)");
        gradient.addColorStop(1, "rgba(225, 100, 40, 0.9)");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - finalHeight, barWidth - 1, finalHeight);

        x += barWidth;
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

<div class="wave-display {className}">
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

    &.wave-desktop {
      // border-top: 2px solid rgba(225, 100, 40, 0.3);
      height: 100%;
      display: flex;
      align-items: flex-end; // 下端に配置
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

    // デスクトップ用の調整
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

    // モバイル用の調整
    &.wave-mobile {
      .wave-container {
        padding: 10px;
        flex-direction: column;
        align-items: stretch; // モバイルでは幅いっぱい

        canvas {
          max-height: 80px;
        }
      }
    }
  }
</style>
