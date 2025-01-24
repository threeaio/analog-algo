export interface Point {
  x: number;
  y: number;
}

export type EasingType = 'linear' | 'easeIn' | 'easeOut';

export interface PatternConfig {
  stripeOrientation: 'vertical' | 'horizontal';
  stripeColor: string;
  stripeDivisions: number; // how many stripes per grid cell (e.g., 2 means half cell width)
  patternOffset?: boolean; // whether to offset the pattern start
}

export abstract class BaseShape {
  protected ctx: CanvasRenderingContext2D;
  protected pattern: PatternConfig | undefined;

  constructor(ctx: CanvasRenderingContext2D, pattern?: PatternConfig) {
    this.ctx = ctx;
    this.pattern = pattern;
  }

  abstract draw(): void;
  abstract update(deltaTime: number): void;

  protected lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  protected lerpPoint(start: Point, end: Point, t: number): Point {
    return {
      x: this.lerp(start.x, end.x, t),
      y: this.lerp(start.y, end.y, t)
    };
  }

  protected ease(t: number, type: EasingType = 'linear'): number {
    switch (type) {
      case 'easeIn':
        return t * t; // Quadratic ease in
      case 'easeOut':
        return t * (2 - t); // Quadratic ease out
      case 'linear':
      default:
        return t;
    }
  }

  protected createStripePattern(cellSize: number): CanvasPattern | null {
    if (!this.pattern) return null;

    const { stripeOrientation, stripeColor, stripeDivisions, patternOffset } = this.pattern;
    const stripeSize = cellSize / stripeDivisions;
    const stripeThickness = stripeSize * 1.2; // Make stripes a bit thicker
    
    // Create a pattern canvas
    const patternCanvas = document.createElement('canvas');
    const size = cellSize * 16; // Make it bigger to ensure cleaner tiling
    patternCanvas.width = size;
    patternCanvas.height = size;
    
    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) return null;

    // Clear pattern canvas
    patternCtx.fillStyle = 'transparent';
    patternCtx.fillRect(0, 0, size, size);

    // Draw stripes
    patternCtx.fillStyle = stripeColor;
    
    const offset = patternOffset ? stripeSize : 0;
    
    if (stripeOrientation === 'vertical') {
      for (let x = offset; x < size; x += stripeSize * 2) {
        patternCtx.fillRect(x, 0, stripeThickness, size);
      }
    } else {
      for (let y = offset; y < size; y += stripeSize * 2) {
        patternCtx.fillRect(0, y, size, stripeThickness);
      }
    }

    return this.ctx.createPattern(patternCanvas, 'repeat');
  }
} 