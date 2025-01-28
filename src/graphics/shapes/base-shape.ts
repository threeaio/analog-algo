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
  stripeWidth: number;     // width of the stripe in units (like SVG dash)
  stripeGap: number;       // gap between stripes in units
  stripeOffset: number;    // where the pattern starts (0-1)
  repetitions: number;     // how many stripe+gap combinations to render
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

    const { stripeOrientation, stripeColor, stripeWidth, stripeGap, stripeOffset, repetitions, patternOffset } = this.pattern;
    
    // Calculate sizes
    const patternUnit = stripeWidth + stripeGap; // One complete stripe+gap unit
    const totalPatternWidth = patternUnit * repetitions;
    
    // Create a pattern canvas sized to fit the complete pattern
    const patternCanvas = document.createElement('canvas');
    const size = cellSize;
    patternCanvas.width = size;
    patternCanvas.height = size;
    
    const patternCtx = patternCanvas.getContext('2d');
    if (!patternCtx) return null;

    // Clear pattern canvas
    patternCtx.fillStyle = 'transparent';
    patternCtx.fillRect(0, 0, size, size);

    // Draw stripes
    patternCtx.fillStyle = window ? getThemeColorHex(stripeColor) : '#ffffff';
    
    // Calculate unit size in pixels
    const unitSize = size / totalPatternWidth;
    const stripePixelWidth = unitSize * stripeWidth;
    const patternPixelUnit = unitSize * patternUnit;
    
    // Calculate offset
    const baseOffset = patternOffset ? patternPixelUnit : 0;
    const offsetPixels = (stripeOffset * size) % size;
    
    if (stripeOrientation === 'vertical') {
      for (let i = 0; i < repetitions; i++) {
        const x = baseOffset + offsetPixels + (i * patternPixelUnit);
        patternCtx.fillRect(x, 0, stripePixelWidth, size);
      }
    } else {
      for (let i = 0; i < repetitions; i++) {
        const y = baseOffset + offsetPixels + (i * patternPixelUnit);
        patternCtx.fillRect(0, y, size, stripePixelWidth);
      }
    }

    return this.ctx.createPattern(patternCanvas, 'repeat');
  }
} 