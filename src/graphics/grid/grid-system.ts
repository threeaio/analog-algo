import { DimensionProvider } from '@/graphics/core/dimension-provider';
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

export interface PerimeterConfig {
  reduceRows?: number;
  reduceCols?: number;
  shiftX?: number;
  shiftY?: number;
}

export interface PerimeterLimits {
  maxReduceRows: number;
  maxReduceCols: number;
  maxShiftX: number;
  maxShiftY: number;
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

  public getEffectiveDimensions(config?: PerimeterConfig): { rows: number; cols: number } {
    const reduceRows = Math.min(config?.reduceRows ?? 0, this.numRows - 1);
    const reduceCols = Math.min(config?.reduceCols ?? 0, this.numCols - 1);

    return {
      rows: this.numRows - reduceRows,
      cols: this.numCols - reduceCols
    };
  }

  private calculatePerimeterIndices(config?: PerimeterConfig): { x: number; y: number }[] {
    // Apply defaults and validate
    const reduceRows = Math.min(config?.reduceRows ?? 0, this.numRows - 1);
    const reduceCols = Math.min(config?.reduceCols ?? 0, this.numCols - 1);
    const shiftX = config?.shiftX ?? 0;
    const shiftY = config?.shiftY ?? 0;

    // Calculate effective dimensions
    const { rows: effectiveRows, cols: effectiveCols } = this.getEffectiveDimensions(config);
    const indices: { x: number; y: number }[] = [];

    // Top edge (excluding right corner)
    for (let x = 0; x <= effectiveCols; x++) {
      indices.push({ 
        x: shiftX + x, 
        y: shiftY 
      });
    }

    // Right edge (excluding corners)
    for (let y = 1; y <= effectiveRows; y++) {
      indices.push({ 
        x: shiftX + effectiveCols, 
        y: shiftY + y 
      });
    }

    // Bottom edge (excluding corners)
    for (let x = effectiveCols - 1; x >= 0; x--) {
      indices.push({ 
        x: shiftX + x, 
        y: shiftY + effectiveRows
      });
    }

    // Left edge (excluding corners)
    for (let y = effectiveRows - 1; y > 0; y--) {
      indices.push({ 
        x: shiftX, 
        y: shiftY + y 
      });
    }

    return indices;
  }

  private indicesToPoints(indices: { x: number; y: number }[]): Point[] {
    const dims = this.getDimensions();
    return indices.map(index => ({
      x: index.x * dims.cellWidth,
      y: index.y * dims.cellHeight
    }));
  }

  public getPerimeterPoints(config?: PerimeterConfig): Point[] {
    const indices = this.calculatePerimeterIndices(config);
    return this.indicesToPoints(indices);
  }

  public getPerimeterLimits(currentConfig?: PerimeterConfig): PerimeterLimits {
    const reduceRows = currentConfig?.reduceRows ?? 0;
    const reduceCols = currentConfig?.reduceCols ?? 0;

    return {
      maxReduceRows: this.numRows - 1,
      maxReduceCols: this.numCols - 1,
      maxShiftX: this.numCols - (this.numCols - reduceCols),
      maxShiftY: this.numRows - (this.numRows - reduceRows)
    };
  }

  public destroy(): void {
    this.subscribers = [];
  }
} 