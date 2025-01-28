import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { GridConfig } from '@/graphics/grid/grid-system';
import * as React from 'react';
interface GridControlsProps {
  gridConfig: GridConfig;
  handleGridConfigChange: (key: keyof GridConfig, value: number) => void;
}

const GridControls: React.FC<GridControlsProps> = (props) => {
  const { gridConfig, handleGridConfigChange } = props;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          Open Grid Settings
        </Button>
      </SheetTrigger>

      <SheetContent title="Grid Settings" className="uppercase" side="bottom">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-4 py-4">
            {/* Rows Control */}
            <div className="space-y-2">
              <Label className="truncate text-xs">Rows</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[gridConfig.numRows ?? 8]}
                  onValueChange={([value]) => handleGridConfigChange('numRows', value)}
                  min={4}
                  max={32}
                  step={4}
                  className="w-[60%]"
                />
                <span className="text-muted-foreground text-xs">{gridConfig.numRows}</span>
              </div>
            </div>
            {/* Columns Control */}
            <div className="space-y-2">
              <Label className="truncate text-xs">Columns</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[gridConfig.numCols ?? 8]}
                  onValueChange={([value]) => handleGridConfigChange('numCols', value)}
                  min={4}
                  max={32}
                  step={4}
                  className="w-[60%]"
                />
                <span className="text-muted-foreground text-xs">{gridConfig.numCols}</span>
              </div>
            </div>
            {/* Tick Height Control */}
            <div className="space-y-2">
              <Label className="truncate text-xs">Tick Height</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[gridConfig.tickHeight ?? 4]}
                  onValueChange={([value]) => handleGridConfigChange('tickHeight', value)}
                  min={2}
                  max={8}
                  step={1}
                  className="w-[60%]"
                />
                <span className="text-muted-foreground text-xs">{gridConfig.tickHeight}px</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default GridControls;
