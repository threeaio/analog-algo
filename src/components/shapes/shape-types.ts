import { EasingType } from '@/canvas/shapes/base-shape';

export interface ActiveShape {
  id: string;
  type: string;
  speed: number;
  offset: number;
  patternOffset: boolean;
  pauseDuration: number;
  easing: string;
}

export interface OpenPanels {
  [shapeId: string]: {
    animation?: boolean;
    pattern?: boolean;
  };
} 