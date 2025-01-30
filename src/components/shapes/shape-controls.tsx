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
import { ActiveShape, AnimationConfig, PatternConfig, PerimeterConfig } from './shape-types';
import * as React from 'react';
import { shapes } from '@/config/shapes';
import { ThemeColorName, themeColors } from '@/lib/theme-colors';

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

interface AnimationPropertiesProps {
  shape: ActiveShape;
}

function AnimationProperties({ shape }: AnimationPropertiesProps) {
  return (
    <dl className={`grid hidden grid-cols-3 gap-x-2 text-xs`}>
      <dt className="col-span-2 text-right">Speed</dt>
      <dd className="text-muted-foreground">{shape.animation.speed}ms</dd>
      <dt className="col-span-2 text-right">Pause</dt>
      <dd className="text-muted-foreground">{shape.animation.pauseDuration}ms</dd>
      <dt className="col-span-2 text-right">Easing</dt>
      <dd className="text-muted-foreground">{shape.animation.easing}</dd>
    </dl>
  );
}

interface PatternPropertiesProps {
  shape: ActiveShape;
}

function PatternProperties({ shape }: PatternPropertiesProps) {
  return (
    <dl className={`grid hidden grid-cols-3 gap-x-2 text-xs`}>
      <dt className="col-span-2 text-right">Stripe Width</dt>
      <dd className="text-muted-foreground">{shape.pattern.stripeWidth}</dd>
      <dt className="col-span-2 text-right">Gap Width</dt>
      <dd className="text-muted-foreground">{shape.pattern.stripeGap}</dd>
      <dt className="col-span-2 text-right">Repetitions</dt>
      <dd className="text-muted-foreground">{shape.pattern.repetitions}</dd>
      <dt className="col-span-2 text-right">Pattern Offset</dt>
      <dd className="text-muted-foreground">{shape.pattern.stripeOffset}</dd>
      <dt className="col-span-2 text-right">Color</dt>
      <dd className="text-muted-foreground">{shape.pattern.stripeColor}</dd>
    </dl>
  );
}

interface ShapePropertiesProps {
  shape: ActiveShape;
}

function ShapeProperties({ shape }: ShapePropertiesProps) {
  return (
    <dl className={`hidden grid-cols-3 gap-x-2 text-xs`}>
      <dt className="col-span-2 text-right">Rotate Offset</dt>
      <dd className="text-muted-foreground">{shape.offset}</dd>
      <dt className="col-span-2 text-right">Reduce Rows</dt>
      <dd className="text-muted-foreground">{shape.perimeterConfig?.reduceRows ?? 0}</dd>
      <dt className="col-span-2 text-right">Reduce Cols</dt>
      <dd className="text-muted-foreground">{shape.perimeterConfig?.reduceCols ?? 0}</dd>
      <dt className="col-span-2 text-right">Shift X</dt>
      <dd className="text-muted-foreground">{shape.perimeterConfig?.shiftX ?? 0}</dd>
      <dt className="col-span-2 text-right">Shift Y</dt>
      <dd className="text-muted-foreground">{shape.perimeterConfig?.shiftY ?? 0}</dd>
    </dl>
  );
}

interface ShapeControlsPanelProps {
  shape: ActiveShape;
  handleShapeConfigChange: (
    shapeId: string,
    config: {
      offset?: number;
      perimeterConfig?: Partial<PerimeterConfig>;
    }
  ) => void;
  handleSheetOpenChange: (isOpen: boolean) => void;
}

function ShapeControlsPanel({
  shape,
  handleShapeConfigChange,
  handleSheetOpenChange,
}: ShapeControlsPanelProps) {
  return (
    <Sheet onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild className="self-start">
        <Button variant="ghost" size="sm">
          Shape Controls
        </Button>
      </SheetTrigger>
      <SheetContent className="text-xs uppercase" side="bottom">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="space-y-2">
              <Label className="truncate text-xs">Rotate Offset</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[shape.offset]}
                  onValueChange={([value]) => handleShapeConfigChange(shape.id, { offset: value })}
                  min={0}
                  max={10}
                  step={1}
                  className="w-[60%]"
                />
                <span className="text-muted-foreground text-xs">{shape.offset}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="truncate text-xs">Reduce Rows</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[shape.perimeterConfig?.reduceRows ?? 0]}
                    onValueChange={([value]) =>
                      handleShapeConfigChange(shape.id, {
                        perimeterConfig: {
                          ...shape.perimeterConfig,
                          reduceRows: value,
                        },
                      })
                    }
                    min={0}
                    max={7}
                    step={1}
                    className="w-[60%]"
                  />
                  <span className="text-muted-foreground text-xs">
                    {shape.perimeterConfig?.reduceRows ?? 0}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="truncate text-xs">Reduce Columns</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[shape.perimeterConfig?.reduceCols ?? 0]}
                    onValueChange={([value]) =>
                      handleShapeConfigChange(shape.id, {
                        perimeterConfig: {
                          ...shape.perimeterConfig,
                          reduceCols: value,
                        },
                      })
                    }
                    min={0}
                    max={7}
                    step={1}
                    className="w-[60%]"
                  />
                  <span className="text-muted-foreground text-xs">
                    {shape.perimeterConfig?.reduceCols ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="truncate text-xs">Shift X</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[shape.perimeterConfig?.shiftX ?? 0]}
                    onValueChange={([value]) =>
                      handleShapeConfigChange(shape.id, {
                        perimeterConfig: {
                          ...shape.perimeterConfig,
                          shiftX: value,
                        },
                      })
                    }
                    min={0}
                    max={7}
                    step={1}
                    className="w-[60%]"
                  />
                  <span className="text-muted-foreground text-xs">
                    {shape.perimeterConfig?.shiftX ?? 0}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="truncate text-xs">Shift Y</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[shape.perimeterConfig?.shiftY ?? 0]}
                    onValueChange={([value]) =>
                      handleShapeConfigChange(shape.id, {
                        perimeterConfig: {
                          ...shape.perimeterConfig,
                          shiftY: value,
                        },
                      })
                    }
                    min={0}
                    max={7}
                    step={1}
                    className="w-[60%]"
                  />
                  <span className="text-muted-foreground text-xs">
                    {shape.perimeterConfig?.shiftY ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface AnimationControlsProps {
  shape: ActiveShape;
  handleAnimationConfigChange: (shapeId: string, config: Partial<AnimationConfig>) => void;
  handleSheetOpenChange: (isOpen: boolean) => void;
}

function AnimationControls({
  shape,
  handleAnimationConfigChange,
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
                value={[shape.animation.speed]}
                onValueChange={([value]) => handleAnimationConfigChange(shape.id, { speed: value })}
                min={0}
                max={1000}
                step={100}
                className="w-[60%]"
              />
              <span className="text-muted-foreground">{shape.animation.speed}ms</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="truncate text-xs">Pause Duration</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[shape.animation.pauseDuration]}
                onValueChange={([value]) =>
                  handleAnimationConfigChange(shape.id, { pauseDuration: value })
                }
                min={0}
                max={1000}
                step={100}
                className="w-[60%]"
              />
              <span className="text-muted-foreground">{shape.animation.pauseDuration}ms</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="truncate text-xs">Easing</Label>
            <Select
              value={shape.animation.easing}
              onValueChange={(value) =>
                handleAnimationConfigChange(shape.id, { easing: value as EasingType })
              }
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
  handlePatternConfigChange: (shapeId: string, config: Partial<PatternConfig>) => void;
  handleSheetOpenChange: (isOpen: boolean) => void;
}

function PatternControls({
  shape,
  handlePatternConfigChange,
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
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="space-y-8">
              <div className="space-y-2">
                <Label className="truncate text-xs">Stripe Width</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[shape.pattern.stripeWidth]}
                    onValueChange={([value]) =>
                      handlePatternConfigChange(shape.id, { stripeWidth: value })
                    }
                    min={1}
                    max={24}
                    step={1}
                    className="w-[60%]"
                  />
                  <span className="text-muted-foreground text-xs">{shape.pattern.stripeWidth}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="truncate text-xs">Gap Width</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[shape.pattern.stripeGap]}
                    onValueChange={([value]) =>
                      handlePatternConfigChange(shape.id, { stripeGap: value })
                    }
                    min={0}
                    max={24}
                    step={1}
                    className="w-[60%]"
                  />
                  <span className="text-muted-foreground text-xs">{shape.pattern.stripeGap}</span>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <Label className="truncate text-xs">Repetitions</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[shape.pattern.repetitions]}
                    onValueChange={([value]) =>
                      handlePatternConfigChange(shape.id, { repetitions: value })
                    }
                    min={1}
                    max={16}
                    step={1}
                    className="w-[60%]"
                  />
                  <span className="text-muted-foreground text-xs">{shape.pattern.repetitions}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="truncate text-xs">Pattern Offset</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[shape.pattern.stripeOffset]}
                    onValueChange={([value]) =>
                      handlePatternConfigChange(shape.id, { stripeOffset: value })
                    }
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-[60%]"
                  />
                  <span className="text-muted-foreground text-xs">
                    {shape.pattern.stripeOffset}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="truncate text-xs">Color</Label>
              <div className="flex gap-2">
                {(['white', 'redDark', 'green'] as ThemeColorName[]).map((color) => (
                  <button
                    key={color}
                    onClick={() => handlePatternConfigChange(shape.id, { stripeColor: color })}
                    className={`h-8 w-8 border-2 transition-all ${
                      shape.pattern.stripeColor === color
                        ? 'scale-110 border-3a-paper'
                        : 'border-transparent hover:border-3a-white/50'
                    } ${
                      color === 'white'
                        ? 'bg-3a-white'
                        : color === 'redDark'
                          ? 'bg-3a-red-dark'
                          : 'bg-3a-green'
                    }`}
                    aria-label={`Set stripe color to ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ShapeControls;
