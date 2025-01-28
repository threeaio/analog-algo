import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EasingType } from '@/graphics/shapes/base-shape';
import { ActiveShape } from './shape-types';
import * as React from 'react';
import { shapes } from '@/config/shapes';

interface ShapeControlsProps {
  shape: ActiveShape;
  handleSpeedChange: (shapeId: string, newSpeed: number) => void;
  handlePauseDurationChange: (shapeId: string, newDuration: number) => void;
  handleEasingChange: (shapeId: string, newEasing: EasingType) => void;
  handleOffsetChange: (shapeId: string, newOffset: number) => void;
  handlePatternOffsetChange: (shapeId: string, newOffset: boolean) => void;
  handleSheetOpenChange: (shapeId: string, panel: 'animation' | 'pattern', isOpen: boolean) => void;
  handleRemoveShape: (shapeId: string) => void;
}

const ShapeControls: React.FC<ShapeControlsProps> = (props) => {
  const {
    shape,
    handleSpeedChange,
    handlePauseDurationChange,
    handleEasingChange,
    handleOffsetChange,
    handlePatternOffsetChange,
    handleSheetOpenChange,
    handleRemoveShape,
  } = props;

  const [isAnimationOpen, setIsAnimationOpen] = React.useState(false);
  const [isPatternOpen, setIsPatternOpen] = React.useState(false);

  const handleAnimationOpenChange = (isOpen: boolean) => {
    setIsAnimationOpen(isOpen);
    handleSheetOpenChange(shape.id, 'animation', isOpen);
  };

  const handlePatternOpenChange = (isOpen: boolean) => {
    setIsPatternOpen(isOpen);
    handleSheetOpenChange(shape.id, 'pattern', isOpen);
  };

  return (
    <div className="group">
      <div className="grid grid-cols-8 items-baseline justify-start gap-4">
        <h3 className="tracking-widest">{shapes[shape.type].label}</h3>
        <div className={`col-span-6`}>
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
                handleSpeedChange={handleSpeedChange}
                handlePauseDurationChange={handlePauseDurationChange}
                handleEasingChange={handleEasingChange}
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
                handleOffsetChange={handleOffsetChange}
                handlePatternOffsetChange={handlePatternOffsetChange}
                handleSheetOpenChange={handlePatternOpenChange}
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

interface AnimationPropertiesProps {
  shape: ActiveShape;
}

function AnimationProperties({ shape }: AnimationPropertiesProps) {
  return (
    <dl className={`grid grid-cols-3 gap-x-2 text-xs`}>
      <dt className="col-span-2 text-right">Speed</dt>
      <dd className="text-muted-foreground">{shape.speed}ms</dd>
      <dt className="col-span-2 text-right">Pause</dt>
      <dd className="text-muted-foreground">{shape.pauseDuration}ms</dd>
      <dt className="col-span-2 text-right">Easing</dt>
      <dd className="text-muted-foreground">{shape.easing}</dd>
    </dl>
  );
}

interface PatternPropertiesProps {
  shape: ActiveShape;
}

function PatternProperties({ shape }: PatternPropertiesProps) {
  return (
    <dl className={`grid grid-cols-3 gap-x-2 text-xs`}>
      <dt className="col-span-2 text-right">Offset</dt>
      <dd className="text-muted-foreground">{shape.offset} steps</dd>
      <dt className="col-span-2 text-right">Pattern Offset</dt>
      <dd className="text-muted-foreground">{shape.patternOffset ? 'Yes' : 'No'}</dd>
    </dl>
  );
}

interface AnimationControlsProps {
  shape: ActiveShape;
  handleSpeedChange: (shapeId: string, newSpeed: number) => void;
  handlePauseDurationChange: (shapeId: string, newDuration: number) => void;
  handleEasingChange: (shapeId: string, newEasing: EasingType) => void;
  handleSheetOpenChange: (isOpen: boolean) => void;
}

function AnimationControls({
  shape,
  handleSpeedChange,
  handlePauseDurationChange,
  handleEasingChange,
  handleSheetOpenChange,
}: AnimationControlsProps) {
  return (
    <Sheet onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild className="self-start">
        <Button variant="ghost" size="sm">
          Animation Controls
        </Button>
      </SheetTrigger>
      <SheetContent title="Animation Controls" className="text-xs uppercase" side="bottom">
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="space-y-2">
            <Label className="truncate text-xs">Animation Duration</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[shape.speed]}
                onValueChange={([value]) => handleSpeedChange(shape.id, value)}
                min={0}
                max={1000}
                step={100}
                className="w-[60%]"
              />
              <span className="text-muted-foreground">{shape.speed}ms</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="truncate text-xs">Pause Duration</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[shape.pauseDuration]}
                onValueChange={([value]) => handlePauseDurationChange(shape.id, value)}
                min={0}
                max={1000}
                step={100}
                className="w-[60%]"
              />
              <span className="text-muted-foreground">{shape.pauseDuration}ms</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="truncate text-xs">Easing</Label>
            <Select
              value={shape.easing}
              onValueChange={(value) => handleEasingChange(shape.id, value as EasingType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select easing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="easeIn">Ease In</SelectItem>
                <SelectItem value="easeOut">Ease Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface PatternControlsProps {
  shape: ActiveShape;
  handleOffsetChange: (shapeId: string, newOffset: number) => void;
  handlePatternOffsetChange: (shapeId: string, newOffset: boolean) => void;
  handleSheetOpenChange: (isOpen: boolean) => void;
}

function PatternControls({
  shape,
  handleOffsetChange,
  handlePatternOffsetChange,
  handleSheetOpenChange,
}: PatternControlsProps) {
  return (
    <Sheet onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild className="self-start">
        <Button variant="ghost" size="sm">
          Pattern Controls
        </Button>
      </SheetTrigger>
      <SheetContent className="text-xs uppercase" side="bottom">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 items-center gap-4 py-4">
            <div className="space-y-2">
              <Label className="truncate text-xs">Position Offset</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[shape.offset]}
                  onValueChange={([value]) => handleOffsetChange(shape.id, value)}
                  min={0}
                  max={32}
                  step={1}
                  className="w-[60%]"
                />
                <span className="text-muted-foreground text-xs">{shape.offset} steps</span>
              </div>
            </div>
            <div className="flex cursor-pointer items-center space-x-2">
              <Switch
                checked={shape.patternOffset}
                onCheckedChange={(checked) => handlePatternOffsetChange(shape.id, checked)}
              />
              <Label
                className={`truncate text-xs ${shape.patternOffset ? 'text-3a-white' : 'text-3a-paper'} cursor-pointer`}
                onClick={() => handlePatternOffsetChange(shape.id, !shape.patternOffset)}
              >
                Pattern Offset
              </Label>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ShapeControls;
