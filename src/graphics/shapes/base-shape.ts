import { Dimensions } from "@/graphics/core/dimension-provider";
import { ThemeColorName, getThemeColorHex } from "@/lib/theme-colors";

export interface Point {
  x: number;
  y: number;
}

export type EasingType = 'linear' | 'easeIn' | 'easeOut';

export interface PatternConfig {
  stripeOrientation: 'vertical' | 'horizontal';
  stripeColor: ThemeColorName;
  stripeDivisions: number; // total divisions per cell (e.g., 16 means 16 units per cell)
  stripeWidth: number; // width of the actual stripe in units
  stripeOffset: number; // position where stripe starts within the division
  patternOffset?: boolean; // whether to offset the pattern start between cells
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
  abstract updateDimensions(dimensions: Dimensions): void;

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

    const { stripeOrientation, stripeColor, stripeDivisions, stripeWidth, stripeOffset, patternOffset } = this.pattern;
    const divisionSize = cellSize / stripeDivisions;
    const stripeThickness = divisionSize * stripeWidth;
    
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
    patternCtx.fillStyle = getThemeColorHex(stripeColor);
    
    const baseOffset = patternOffset ? divisionSize : 0;
    const stripePositionOffset = divisionSize * stripeOffset;
    
    if (stripeOrientation === 'vertical') {
      for (let x = baseOffset + stripePositionOffset; x < size; x += divisionSize * stripeDivisions) {
        patternCtx.fillRect(x, 0, stripeThickness, size);
      }
    } else {
      for (let y = baseOffset + stripePositionOffset; y < size; y += divisionSize * stripeDivisions) {
        patternCtx.fillRect(0, y, size, stripeThickness);
      }
    }

    return this.ctx.createPattern(patternCanvas, 'repeat');
  }
} 