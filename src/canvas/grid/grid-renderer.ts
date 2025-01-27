import { GridSystem } from './grid-system';

export interface GridRenderConfig {
  strokeStyle?: string;
  lineWidth?: number;
}

export class GridRenderer {
  private ctx: CanvasRenderingContext2D;
  private grid: GridSystem;
  private config: GridRenderConfig;

  constructor(ctx: CanvasRenderingContext2D, grid: GridSystem, config?: GridRenderConfig) {
    this.ctx = ctx;
    this.grid = grid;
    this.config = {
      strokeStyle: config?.strokeStyle ?? '#fff',
      lineWidth: config?.lineWidth ?? 0.5
    };

    // Subscribe to grid changes to trigger redraws
    this.grid.subscribe(() => this.draw());
  }

  public draw(): void {
    const { horizontal, vertical } = this.grid.getGridLines();
    
    // Set drawing styles
    this.ctx.strokeStyle = this.config.strokeStyle!;
    this.ctx.lineWidth = this.config.lineWidth!;

    // Draw horizontal lines
    horizontal.forEach(([start, end]) => {
      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.stroke();
    });

    // Draw vertical lines with ticks
    vertical.forEach(points => {
      this.ctx.beginPath();
      for (let i = 0; i < points.length; i += 2) {
        this.ctx.moveTo(points[i].x, points[i].y);
        this.ctx.lineTo(points[i + 1].x, points[i + 1].y);
      }
      this.ctx.stroke();
    });
  }

  public setConfig(config: Partial<GridRenderConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
    this.draw();
  }

  public destroy(): void {
    // Clean up any subscriptions or resources
    this.grid.subscribe(() => {});
  }
} 