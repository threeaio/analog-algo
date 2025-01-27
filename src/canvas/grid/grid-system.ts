import { DimensionProvider } from '@/canvas/core/dimension-provider';
import { Point } from '../shapes/base-shape';

export interface GridConfig {
  numRows?: number;
  numCols?: number;
  tickHeight?: number;
}

export interface GridDimensions {
  width: number;
  height: number;
  cellWidth: number;
  cellHeight: number;
  tickHeight: number;
}

export class GridSystem {
  private numRows: number;
  private numCols: number;
  private tickHeight: number;
  private width: number;
  private height: number;
  private subscribers: ((dimensions: GridDimensions) => void)[] = [];

  constructor(dimensionProvider: DimensionProvider, config?: GridConfig) {
    this.numRows = config?.numRows ?? 8;
    this.numCols = config?.numCols ?? 8;
    this.tickHeight = config?.tickHeight ?? 7;
    
    const dimensions = dimensionProvider.getDimensions();
    this.width = dimensions.width;
    this.height = dimensions.height;

    dimensionProvider.subscribe((dimensions) => {
      this.width = dimensions.width;
      this.height = dimensions.height;
      this.notifySubscribers();
    });
  }

  private notifySubscribers(): void {
    const dimensions = this.getDimensions();
    this.subscribers.forEach(callback => callback(dimensions));
  }

  public subscribe(callback: (dimensions: GridDimensions) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
  
  public setConfig(config: Partial<GridConfig>): void {
    this.numRows = config?.numRows ?? this.numRows;
    this.numCols = config?.numCols ?? this.numCols;
    this.tickHeight = config?.tickHeight ?? this.tickHeight;
    this.notifySubscribers();
  }

  public getConfig(): GridConfig {
    return {
      numRows: this.numRows,
      numCols: this.numCols,
      tickHeight: this.tickHeight
    };
  }

  public getDimensions(): GridDimensions {
    return {
      width: this.width,
      height: this.height,
      cellWidth: this.width / this.numCols,
      cellHeight: this.height / this.numRows,
      tickHeight: this.tickHeight
    };
  }

  public getCellSize(): number {
    return this.width / this.numCols;
  }

  public getGridLines(): { horizontal: Point[][]; vertical: Point[][] } {
    const dims = this.getDimensions();
    const horizontal: Point[][] = [];
    const vertical: Point[][] = [];

    // Horizontal lines
    for (let y = 0; y <= this.numRows; y++) {
      horizontal.push([
        { x: 0, y: y * dims.cellHeight },
        { x: dims.width, y: y * dims.cellHeight }
      ]);
    }

    // Vertical lines with ticks
    for (let x = 0; x <= this.numCols; x++) {
      const points: Point[] = [];
      for (let y = 0; y <= this.numRows; y++) {
        const isTop = y === 0;
        const isBottom = y === this.numRows;
        const yPos = y * dims.cellHeight;

        if (isTop) {
          points.push(
            { x: x * dims.cellWidth, y: yPos },
            { x: x * dims.cellWidth, y: yPos + this.tickHeight }
          );
        } else if (isBottom) {
          points.push(
            { x: x * dims.cellWidth, y: yPos },
            { x: x * dims.cellWidth, y: yPos - this.tickHeight }
          );
        } else {
          points.push(
            { x: x * dims.cellWidth, y: yPos - this.tickHeight },
            { x: x * dims.cellWidth, y: yPos + this.tickHeight }
          );
        }
      }
      vertical.push(points);
    }

    return { horizontal, vertical };
  }

  public getPerimeterPoints(): Point[] {
    const dims = this.getDimensions();
    const points: Point[] = [];

    // Top edge
    for (let x = 0; x <= this.numCols; x++) {
      points.push({ x: x * dims.cellWidth, y: 0 });
    }
    // Right edge
    for (let y = 1; y <= this.numRows; y++) {
      points.push({ x: dims.width, y: y * dims.cellHeight });
    }
    // Bottom edge (reverse)
    for (let x = this.numCols - 1; x >= 0; x--) {
      points.push({ x: x * dims.cellWidth, y: dims.height });
    }
    // Left edge (reverse)
    for (let y = this.numRows - 1; y > 0; y--) {
      points.push({ x: 0, y: y * dims.cellHeight });
    }

    return points;
  }

  public destroy(): void {
    this.subscribers = [];
  }
} 