export class WaveVisualizer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private isMobile: boolean = false;

  constructor(canvas: HTMLCanvasElement, isMobile: boolean = false) {
    this.canvas = canvas;
    this.isMobile = isMobile;
    this.ctx = canvas.getContext("2d");
  }

  updateCanvasSize(): void {
    if (!this.canvas || !this.ctx) return;

    const container = this.canvas.parentElement!;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + "px";
    this.canvas.style.height = rect.height + "px";
    this.ctx.scale(dpr, dpr);

    console.log(
      `Resize detected [${this.isMobile ? "mobile" : "desktop"}]\n` +
        `container: ${rect.width} x ${rect.height}\n` +
        `canvas: ${this.canvas.width} x ${this.canvas.height}`,
    );
  }

  startVisualization(
    getFrequencyData: () => Uint8Array | null,
    bufferLength: number,
  ): void {
    if (!this.ctx || !this.canvas) {
      console.error("Missing required components for visualization:", {
        ctx: !!this.ctx,
        canvas: !!this.canvas,
      });
      return;
    }

    const drawSpectrum = () => {
      const dataArray = getFrequencyData();

      // データが取得できない場合は終了
      if (!dataArray || !this.ctx || !this.canvas) {
        console.error("Stopping visualization");
        this.animationId = null;
        return;
      }

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = this.canvas.width / dpr;
      const displayHeight = this.canvas.height / dpr;

      const barCount = bufferLength;

      for (let i = 0; i < barCount; i++) {
        const normalized = dataArray[i] / 255;

        const baseLength =
          Math.pow(normalized, 2.5) * 0.8 +
          Math.sin(normalized * Math.PI * 2) * 0.1;

        let gradient: CanvasGradient;
        let x: number, y: number, width: number, height: number;

        if (this.isMobile) {
          // モバイル: 縦向き波形描画
          const barHeight = displayHeight / barCount;
          const barWidth = baseLength * displayWidth;
          const finalWidth = Math.max(barWidth, 2);

          x = 0;
          y = i * barHeight;
          width = finalWidth;
          height = barHeight - 1;

          gradient = this.ctx.createLinearGradient(0, 0, finalWidth, 0);
        } else {
          // デスクトップ: 横向き波形描画
          const barWidth = displayWidth / barCount;
          const barHeight = baseLength * displayHeight;
          const finalHeight = Math.max(barHeight, 2);

          x = i * barWidth;
          y = displayHeight - finalHeight;
          width = barWidth - 1;
          height = finalHeight;

          gradient = this.ctx.createLinearGradient(
            0,
            displayHeight - finalHeight,
            0,
            displayHeight,
          );
        }

        gradient.addColorStop(0, "rgba(240, 183, 77, 0.9)");
        gradient.addColorStop(1, "rgba(225, 100, 40, 0.9)");

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, width, height);
      }

      this.animationId = requestAnimationFrame(drawSpectrum);
    };

    drawSpectrum();
  }

  stopVisualization(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  setMobile(isMobile: boolean): void {
    this.isMobile = isMobile;
  }

  cleanup(): void {
    this.stopVisualization();
    this.canvas = null;
    this.ctx = null;
  }
}
