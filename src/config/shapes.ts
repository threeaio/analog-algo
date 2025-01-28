import { GridSystem } from "@/graphics/grid/grid-system";
import { PatternConfig } from "@/graphics/shapes/base-shape";
import { PolygonWalker } from "@/graphics/shapes/polygon-walker";

export const basePattern: PatternConfig = {
  stripeOrientation: 'vertical',
  stripeColor: '#c13',
  stripeDivisions: 24,
};

export interface ShapeConfig {
  create: (ctx: CanvasRenderingContext2D, grid: GridSystem) => PolygonWalker;
  label: string;
}

export const shapes: Record<string, ShapeConfig> = {
  triangle: {
    create: (ctx, grid) => PolygonWalker.createTriangle(ctx, grid, {
      pattern: { ...basePattern },
    }),
    label: 'Triangle'
  },
  rectangle: {
    create: (ctx, grid) => PolygonWalker.createRectangle(ctx, grid, {
      pattern: { 
        ...basePattern,
      },
    }),
    label: 'Rectangle'
  },
  pentagon: {
    create: (ctx, grid) => PolygonWalker.createRegularPolygon(ctx, 7, grid, {
      pattern: {
        ...basePattern,
      },
    }),
    label: 'Pentagon'
  }
}; 