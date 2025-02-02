import { AnimationConfig, ActiveShape } from '@/components/shapes/shape-types';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as React from 'react';
import { EasingType } from '@/graphics/shapes/base-shape';

interface AnimationPropertiesProps {
  shape: ActiveShape;
}

export function AnimationProperties({ shape }: AnimationPropertiesProps) {
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

interface AnimationControlsProps {
  shape: ActiveShape;
  handleAnimationConfigChange: (shapeId: string, config: Partial<AnimationConfig>) => void;
  handleSheetOpenChange: (isOpen: boolean) => void;
}

export function AnimationControls({
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
      <SheetContent title="Animation Controls" className="text-xs uppercase" side="left">
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

