import { ActiveShape, PatternConfig } from '@/components/shapes/shape-types';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { colorMap, ThemeColorName } from '@/lib/theme-colors';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import * as React from 'react';

interface PatternControlsProps {
  shape: ActiveShape;
  handlePatternConfigChange: (shapeId: string, config: Partial<PatternConfig>) => void;
  handleSheetOpenChange: (isOpen: boolean) => void;
}

export function PatternControls({
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
      <SheetContent className="text-xs uppercase" side="left">
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
                {(['white', 'redDark', 'green', 'grayDarkest'] as ThemeColorName[]).map((color) => (
                  <button
                    key={color}
                    onClick={() => handlePatternConfigChange(shape.id, { stripeColor: color })}
                    className={`h-8 w-8 border-2 transition-all ${
                      shape.pattern.stripeColor === color
                        ? 'scale-110 border-3a-paper'
                        : 'border-transparent hover:border-3a-white/50'
                    }`}
                    style={{ backgroundColor: `hsl(var(${colorMap[color]}))` }}
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

interface PatternPropertiesProps {
  shape: ActiveShape;
}

export function PatternProperties({ shape }: PatternPropertiesProps) {
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
