import { EasingType } from '@/graphics/shapes/base-shape';
import { ThemeColorName } from '@/lib/theme-colors';

export interface AnimationConfig {
  speed: number;
  pauseDuration: number;
  easing: EasingType;
}

export interface PatternConfig {
  stripeDivisions: number;
  stripeWidth: number;
  stripeOffset: number;
  stripeColor: ThemeColorName;
  patternOffset: boolean;
}

export interface ActiveShape {
  id: string;
  type: string;
  offset: number;
  animation: AnimationConfig;
  pattern: PatternConfig;
}

export interface OpenPanels {
  [shapeId: string]: {
    animation?: boolean;
    pattern?: boolean;
  };
} 