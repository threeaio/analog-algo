import { SheetContent } from '@/components/ui/sheet';
import { ActiveShape, PerimeterConfig } from '@/components/shapes/shape-types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import * as React from 'react';
import { GridSystem } from '@/graphics/grid/grid-system';

interface ShapePropertiesProps {
  shape: ActiveShape;
}

export function ShapeProperties({ shape }: ShapePropertiesProps) {
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
  grid: GridSystem;
  handleShapeConfigChange: (
    shapeId: string,
    config: {
      offset?: number;
      perimeterConfig?: Partial<PerimeterConfig>;
    }
  ) => void;
  handleSheetOpenChange: (isOpen: boolean) => void;
}

export function ShapeControlsPanel({
  shape,
  grid,
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
            <div className="space-y-8">
              <div className="space-y-2">
                <Label className="truncate text-xs">Rotate Offset</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[shape.offset]}
                    onValueChange={([value]) =>
                      handleShapeConfigChange(shape.id, { offset: value })
                    }
                    min={0}
                    max={10}
                    step={1}
                    className="w-[60%]"
                  />
                  <span className="text-muted-foreground text-xs">{shape.offset}</span>
                </div>
              </div>
            </div>
            <div className="space-y-8">
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
                    max={grid.getEffectiveDimensions().rows - 1}
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
                    max={grid.getEffectiveDimensions().cols - 1}
                    step={1}
                    className="w-[60%]"
                  />
                  <span className="text-muted-foreground text-xs">
                    {shape.perimeterConfig?.reduceCols ?? 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
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
                    max={shape.perimeterConfig?.reduceCols ?? 0}
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
                    max={shape.perimeterConfig?.reduceRows ?? 0}
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
