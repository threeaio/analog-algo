import { PatternConfig } from "@/canvas/shapes/base-shape";
import { PolygonWalker } from "@/canvas/shapes/polygon-walker";

export const basePattern: PatternConfig = {
  stripeOrientation: 'vertical',
  stripeColor: '#c13',
  stripeDivisions: 16,
};

export interface ShapeConfig {
  create: (ctx: CanvasRenderingContext2D, speed: number) => PolygonWalker;
  label: string;
}

export const shapes: Record<string, ShapeConfig> = {
  triangle: {
    create: (ctx, speed) => PolygonWalker.createTriangle(ctx, {
      pattern: { ...basePattern },
      animationDuration: speed,
      pauseDuration: 0,
      easing: 'linear'
    }),
    label: 'Triangle'
  },
  rectangle: {
    create: (ctx, speed) => PolygonWalker.createRectangle(ctx, {
      pattern: { 
        ...basePattern,
        patternOffset: true,
      },
      offset: 4,
      animationDuration: speed,
      pauseDuration: 200,
      easing: 'easeOut'
    }),
    label: 'Rectangle'
  },
  pentagon: {
    create: (ctx, speed) => PolygonWalker.createRegularPolygon(ctx, 7, {
      pattern: {
        ...basePattern,
      },
      offset: 8,
      animationDuration: speed,
      pauseDuration: 400,
      easing: 'easeIn'
    }),
    label: 'Pentagon'
  }
}; 