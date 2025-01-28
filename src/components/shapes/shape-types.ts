import { EasingType } from '@/graphics/shapes/base-shape';

export interface ActiveShape {
  id: string;
  type: string;
  speed: number;
  offset: number;
  patternOffset: boolean;
  pauseDuration: number;
  easing: EasingType;
}

export interface OpenPanels {
  [shapeId: string]: {
    animation?: boolean;
    pattern?: boolean;
  };
} 