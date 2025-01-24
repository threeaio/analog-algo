export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private pixelRatio: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');
    this.ctx = context;
    this.pixelRatio = window.devicePixelRatio;
    this.setupCanvas();
  }

  private setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * this.pixelRatio;
    this.canvas.height = rect.height * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public getWidth(): number {
    return this.canvas.width / this.pixelRatio;
  }

  public getHeight(): number {
    return this.canvas.height / this.pixelRatio;
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
  }
} 