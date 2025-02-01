import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EasingType } from '@/graphics/shapes/base-shape';
import { ActiveShape, AnimationConfig, PatternConfig, PerimeterConfig } from './shape-types';
import * as React from 'react';
import { shapes } from '@/config/shapes';
import { PatternControls, PatternProperties } from '@/components/shapes/shape-pattern-setting';
import { ShapeControlsPanel } from '@/components/shapes/shape-shape-settings';
import { ShapeProperties } from '@/components/shapes/shape-shape-settings';
import { AnimationControls } from '@/components/shapes/shape-animation-settings';
import { AnimationProperties } from '@/components/shapes/shape-animation-settings';

interface ShapeControlsProps {
  shape: ActiveShape;
  handleAnimationConfigChange: (shapeId: string, config: Partial<AnimationConfig>) => void;
  handlePatternConfigChange: (shapeId: string, config: Partial<PatternConfig>) => void;
  handleSheetOpenChange: (
    shapeId: string,
    panel: 'animation' | 'pattern' | 'shape',
    isOpen: boolean
  ) => void;
  handleShapeConfigChange: (
    shapeId: string,
    config: {
      offset?: number;
      perimeterConfig?: Partial<PerimeterConfig>;
    }
  ) => void;
  handleRemoveShape: (shapeId: string) => void;
}

const ShapeControls: React.FC<ShapeControlsProps> = ({
  shape,
  handleAnimationConfigChange,
  handlePatternConfigChange,
  handleSheetOpenChange,
  handleShapeConfigChange,
  handleRemoveShape,
}) => {
  const [isAnimationOpen, setIsAnimationOpen] = React.useState(false);
  const [isPatternOpen, setIsPatternOpen] = React.useState(false);
  const [isShapeOpen, setIsShapeOpen] = React.useState(false);

  const handleAnimationOpenChange = (isOpen: boolean) => {
    setIsAnimationOpen(isOpen);
    handleSheetOpenChange(shape.id, 'animation', isOpen);
  };

  const handlePatternOpenChange = (isOpen: boolean) => {
    setIsPatternOpen(isOpen);
    handleSheetOpenChange(shape.id, 'pattern', isOpen);
  };

  const handleShapeOpenChange = (isOpen: boolean) => {
    setIsShapeOpen(isOpen);
    handleSheetOpenChange(shape.id, 'shape', isOpen);
  };

  return (
    <div className="group">
      <div className="grid grid-cols-8 items-baseline justify-start gap-4">
        <h3 className="tracking-widest">{shapes[shape.type].label}</h3>
        <div className={`col-span-6 space-y-2`}>
          <div
            className={`grid grid-cols-6 items-baseline gap-4 transition-opacity duration-300 ${
              isAnimationOpen
                ? 'opacity-100'
                : 'opacity-40 focus-within:opacity-100 group-hover:opacity-100'
            }`}
          >
            <div className="col-span-3">
              <AnimationProperties shape={shape} />
            </div>
            <div className="col-span-3">
              <AnimationControls
                shape={shape}
                handleAnimationConfigChange={handleAnimationConfigChange}
                handleSheetOpenChange={handleAnimationOpenChange}
              />
            </div>
          </div>
          <div
            className={`grid grid-cols-6 gap-4 transition-opacity duration-300 ${
              isPatternOpen
                ? 'opacity-100'
                : 'opacity-40 focus-within:opacity-100 group-hover:opacity-100'
            }`}
          >
            <div className="col-span-3">
              <PatternProperties shape={shape} />
            </div>
            <div className="col-span-3">
              <PatternControls
                shape={shape}
                handlePatternConfigChange={handlePatternConfigChange}
                handleSheetOpenChange={handlePatternOpenChange}
              />
            </div>
          </div>
          <div
            className={`grid grid-cols-6 gap-4 transition-opacity duration-300 ${
              isShapeOpen
                ? 'opacity-100'
                : 'opacity-40 focus-within:opacity-100 group-hover:opacity-100'
            }`}
          >
            <div className="col-span-3">
              <ShapeProperties shape={shape} />
            </div>
            <div className="col-span-3">
              <ShapeControlsPanel
                shape={shape}
                handleShapeConfigChange={handleShapeConfigChange}
                handleSheetOpenChange={handleShapeOpenChange}
              />
            </div>
          </div>
        </div>
        <div className="text-right">
          <Button
            className="self-start text-xs"
            variant="ghost"
            onClick={() => handleRemoveShape(shape.id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShapeControls;
