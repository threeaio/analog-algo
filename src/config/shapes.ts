import { PatternConfig } from "@/canvas/shapes/base-shape";
import { PolygonWalker } from "@/canvas/shapes/polygon-walker";

export const basePattern: PatternConfig = {
  stripeOrientation: 'vertical',
  stripeColor: '#c13',
  stripeDivisions: 24,
};

export interface ShapeConfig {
  create: (ctx: CanvasRenderingContext2D) => PolygonWalker;
  label: string;
}

export const shapes: Record<string, ShapeConfig> = {
  triangle: {
    create: (ctx) => PolygonWalker.createTriangle(ctx, {
      pattern: { ...basePattern },
    }),
    label: 'Triangle'
  },
  rectangle: {
    create: (ctx) => PolygonWalker.createRectangle(ctx, {
      pattern: { 
        ...basePattern,
      },
    }),
    label: 'Rectangle'
  },
  pentagon: {
    create: (ctx) => PolygonWalker.createRegularPolygon(ctx, 7, {
      pattern: {
        ...basePattern,
      },
    }),
    label: 'Pentagon'
  }
}; 