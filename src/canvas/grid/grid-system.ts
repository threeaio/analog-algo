import { Point } from '../shapes/base-shape';

export interface GridConfig {
  numRows?: number;
  numCols?: number;
  tickHeight?: number;
}

export class GridSystem {
  private ctx: CanvasRenderingContext2D;
  private numRows: number;
  private numCols: number;
  private tickHeight: number;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, config?: GridConfig) {
    this.ctx = ctx;
    this.numRows = config?.numRows ?? 8;
    this.numCols = config?.numCols ?? 8;
    this.tickHeight = config?.tickHeight ?? 7;
    this.width = ctx.canvas.width / window.devicePixelRatio;
    this.height = ctx.canvas.height / window.devicePixelRatio;
  }

  public getCellSize(): number {
    return this.width / this.numCols; // Since we're using a square grid, width/numCols === height/numRows
  }

  public draw() {
    const rowHeight = this.height / this.numRows;
    const colWidth = this.width / this.numCols;

    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 0.5;

    for (let y = 0; y <= this.numRows; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * rowHeight);
      this.ctx.lineTo(this.width, y * rowHeight);
      this.ctx.stroke();

      for (let x = 0; x <= this.numCols; x++) {
        if (y === 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(x * colWidth, y * rowHeight);
          this.ctx.lineTo(x * colWidth, y * rowHeight + this.tickHeight);
          this.ctx.stroke();
        } else if (y === this.numRows) {
          this.ctx.beginPath();
          this.ctx.moveTo(x * colWidth, y * rowHeight);
          this.ctx.lineTo(x * colWidth, y * rowHeight - this.tickHeight);
          this.ctx.stroke();
        } else {
          this.ctx.beginPath();
          this.ctx.moveTo(x * colWidth, y * rowHeight - this.tickHeight);
          this.ctx.lineTo(x * colWidth, y * rowHeight + this.tickHeight);
          this.ctx.stroke();
        }
      }
    }
  }

  public getPerimeterPoints(): Point[] {
    const points: Point[] = [];
    const rowHeight = this.height / this.numRows;
    const colWidth = this.width / this.numCols;

    // Top edge
    for (let x = 0; x <= this.numCols; x++) {
      points.push({ x: x * colWidth, y: 0 });
    }
    // Right edge
    for (let y = 1; y <= this.numRows; y++) {
      points.push({ x: this.width, y: y * rowHeight });
    }
    // Bottom edge (reverse)
    for (let x = this.numCols - 1; x >= 0; x--) {
      points.push({ x: x * colWidth, y: this.height });
    }
    // Left edge (reverse)
    for (let y = this.numRows - 1; y > 0; y--) {
      points.push({ x: 0, y: y * rowHeight });
    }

    return points;
  }
} 