import { EasingType } from '@/graphics/shapes/base-shape';
import { ThemeColorName } from '@/lib/theme-colors';

export interface AnimationConfig {
  speed: number;
  pauseDuration: number;
  easing: EasingType;
}

export interface PatternConfig {
  stripeOrientation: 'vertical' | 'horizontal';
  stripeColor: ThemeColorName;
  stripeWidth: number;     // width of the stripe in units
  stripeGap: number;       // gap between stripes in units
  stripeOffset: number;    // where the pattern starts (0-1)
  repetitions: number;     // how many stripe+gap combinations to render
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
    shape?: boolean;
  };
} 