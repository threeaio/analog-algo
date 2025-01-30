import { EasingType } from '@/graphics/shapes/base-shape';
import { ThemeColorName } from '@/lib/theme-colors';
import { PatternConfig } from '@/graphics/shapes/base-shape';
import { PerimeterConfig } from '@/graphics/grid/grid-system';

export interface AnimationConfig {
  speed: number;
  pauseDuration: number;
  easing: EasingType;
}

export interface ActiveShape {
  id: string;
  type: string;
  offset: number;
  animation: AnimationConfig;
  pattern: PatternConfig;
  perimeterConfig?: PerimeterConfig;
}

export interface OpenPanels {
  [shapeId: string]: {
    animation?: boolean;
    pattern?: boolean;
    shape?: boolean;
  };
}

export type { PatternConfig, PerimeterConfig }; 