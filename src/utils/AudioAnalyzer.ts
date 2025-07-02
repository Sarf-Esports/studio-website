export class AudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private dataArray: Uint8Array | null = null;
  private bufferLength = 0;
  private currentAudioElement: HTMLAudioElement | null = null;
  private static globalAudioContext: AudioContext | null = null;

  constructor() {}

  private getAudioContext(): AudioContext {
    if (!AudioAnalyzer.globalAudioContext) {
      AudioAnalyzer.globalAudioContext = new AudioContext();
    }
    return AudioAnalyzer.globalAudioContext;
  }

  initialize(audioElement: HTMLAudioElement): boolean {
    if (!audioElement) {
      console.error("No audio element provided");
      return false;
    }

    // 現在のaudio要素と同じで、既にsourceが存在する場合はスキップ
    if (this.source && this.currentAudioElement === audioElement) {
      // console.log("Audio already initialized for this element, skipping");
      return true;
    }

    try {
      this.audioContext = this.getAudioContext();

      // 現在のaudio要素と異なる場合、または初回の場合のみソースを作成
      if (this.currentAudioElement !== audioElement || !this.source) {
        if (this.source) {
          this.source.disconnect();
          this.source = null;
        }

        this.source = this.audioContext.createMediaElementSource(audioElement);
        this.analyser = this.audioContext.createAnalyser();
        this.gainNode = this.audioContext.createGain();

        this.analyser.fftSize = 512;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.source.connect(this.analyser);
        this.analyser.connect(this.gainNode);
        this.gainNode.connect(this.audioContext.destination);

        this.gainNode.gain.value = 0.08;

        // 現在のaudio要素を記録
        this.currentAudioElement = audioElement;

        console.log("Audio nodes initialized successfully");
      }
      return true;
    } catch (error: unknown) {
      console.error("Audio initialization failed:", error);
      // MediaElementAudioSourceNodeが既に作成されている場合のエラーを処理
      if (error instanceof Error && error.name === "InvalidStateError") {
        console.error(
          "Audio source already exists for this element - this should not happen with our tracking",
        );
      }
      return false;
    }
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.analyser || !this.dataArray) {
      return null;
    }

    if (this.audioContext?.state === "suspended") {
      this.audioContext.resume();
    }

    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  getBufferLength(): number {
    return this.bufferLength;
  }

  isReady(): boolean {
    return !!(this.analyser && this.dataArray);
  }

  cleanup(): void {
    this.source?.disconnect();
    this.source = null;

    this.analyser?.disconnect();
    this.analyser = null;

    this.gainNode?.disconnect();
    this.gainNode = null;

    // グローバルAudioContextは閉じない（他のコンポーネントで使用される可能性があるため）
    this.audioContext = null;
    this.currentAudioElement = null;
    this.dataArray = null;
    this.bufferLength = 0;
  }
}
