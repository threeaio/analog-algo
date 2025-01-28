import type { HeadFC, PageProps } from 'gatsby';
import { SceneManager } from '@/canvas/core/scene-manager';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import * as React from 'react';
import { shapes } from '@/config/shapes';
import { Switch } from '@/components/ui/switch';
import {
  CanvasDimensionProvider,
  DimensionProvider,
  ElementDimensionProvider,
} from '@/canvas/core/dimension-provider';
import { GridConfig, GridSystem } from '@/canvas/grid/grid-system';
import { GridRendererSvg } from '@/canvas/grid/grid-renderer-svg';
import { EasingType } from '@/canvas/shapes/base-shape';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface ActiveShape {
  id: string;
  type: string;
  speed: number;
  offset: number;
  patternOffset: boolean;
  pauseDuration: number;
  easing: string;
}

interface OpenPanels {
  [shapeId: string]: {
    animation?: boolean;
    pattern?: boolean;
  };
}

const Page01: React.FC<PageProps> = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const sceneRef = React.useRef<SceneManager | null>(null);
  const gridSystemRef = React.useRef<GridSystem | null>(null);
  const dimensionProviderRef = React.useRef<DimensionProvider | null>(null);
  const [activeShapes, setActiveShapes] = React.useState<ActiveShape[]>([]);
  const [selectedShape, setSelectedShape] = React.useState<string>('');
  const [gridConfig, setGridConfig] = React.useState<GridConfig>({
    numRows: 8,
    numCols: 8,
    tickHeight: 4,
  });
  const [openPanels, setOpenPanels] = React.useState<OpenPanels>({});

  // Initialize everything
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    if (!canvas || !svg) return;

    // 1. Initialize dimension provider
    const provider = new CanvasDimensionProvider(canvas);
    dimensionProviderRef.current = provider;

    // 2. Initialize grid system
    const grid = new GridSystem(provider);
    gridSystemRef.current = grid;

    // 3. Initialize scene and grid renderer
    const scene = new SceneManager(canvas, provider);
    const svgGrid = new GridRendererSvg(svg, grid);
    sceneRef.current = scene;
    scene.start();

    // Setup dimension change handlers
    const unsubscribe = provider.subscribe((dimensions) => {
      // Update shapes
      activeShapes.forEach((shape) => {
        const shapeInstance = scene.shapes.get(shape.id);
        if (shapeInstance) {
          shapeInstance.updateDimensions(dimensions);
        }
      });

      // Update canvas/svg size
      scene.updateCanvasSize(dimensions);
      svg.setAttribute('width', dimensions.width.toString());
      svg.setAttribute('height', dimensions.height.toString());
      svg.setAttribute('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);
    });

    return () => {
      scene.stop();
      unsubscribe();
      svgGrid.destroy();
      grid.destroy();
      provider.destroy();
    };
  }, []);

  const handleShapeSelect = (value: string) => {
    setSelectedShape(value);
  };

  const handleAddShape = () => {
    if (!sceneRef.current || !selectedShape || !gridSystemRef.current) return;

    const defaultSpeed = 600;
    const defaultPauseDuration = 300;
    const shape = shapes[selectedShape].create(
      sceneRef.current.getContext(),
      gridSystemRef.current
    );
    const id = sceneRef.current.addShape(shape);
    shape.setAnimationDuration(defaultSpeed);
    shape.setPauseDuration(defaultPauseDuration);

    setActiveShapes((prev) => [
      ...prev,
      {
        id,
        type: selectedShape,
        speed: defaultSpeed,
        offset: 0,
        patternOffset: false,
        pauseDuration: defaultPauseDuration,
        easing: 'linear',
      },
    ]);
  };

  const handleRemoveShape = (shapeId: string) => {
    sceneRef.current?.removeShape(shapeId);
    setActiveShapes((prev) => prev.filter((shape) => shape.id !== shapeId));
  };

  const handleSpeedChange = (shapeId: string, newSpeed: number) => {
    setActiveShapes((prev) =>
      prev.map((shape) => (shape.id === shapeId ? { ...shape, speed: newSpeed } : shape))
    );
    sceneRef.current?.updateShapeSpeed(shapeId, newSpeed);
  };

  const handleOffsetChange = (shapeId: string, newOffset: number) => {
    setActiveShapes((prev) =>
      prev.map((shape) => (shape.id === shapeId ? { ...shape, offset: newOffset } : shape))
    );
    sceneRef.current?.updateShapeOffset(shapeId, newOffset);
  };

  const handlePatternOffsetChange = (shapeId: string, newOffset: boolean) => {
    setActiveShapes((prev) =>
      prev.map((shape) => (shape.id === shapeId ? { ...shape, patternOffset: newOffset } : shape))
    );
    sceneRef.current?.updateShapePatternOffset(shapeId, newOffset);
  };

  const handlePauseDurationChange = (shapeId: string, newDuration: number) => {
    setActiveShapes((prev) =>
      prev.map((shape) => (shape.id === shapeId ? { ...shape, pauseDuration: newDuration } : shape))
    );
    sceneRef.current?.updateShapePauseDuration(shapeId, newDuration);
  };

  const handleEasingChange = (shapeId: string, newEasing: EasingType) => {
    setActiveShapes((prev) =>
      prev.map((shape) => (shape.id === shapeId ? { ...shape, easing: newEasing } : shape))
    );
    sceneRef.current?.updateShapeEasing(shapeId, newEasing);
  };

  const handleGridConfigChange = (key: keyof GridConfig, value: number) => {
    const newConfig = { ...gridConfig, [key]: value };
    setGridConfig(newConfig);
    gridSystemRef.current?.setConfig(newConfig);
  };

  const handleSheetOpenChange = (
    shapeId: string,
    panel: 'animation' | 'pattern',
    isOpen: boolean
  ) => {
    setOpenPanels((prev) => ({
      ...prev,
      [shapeId]: {
        ...prev[shapeId],
        [panel]: isOpen,
      },
    }));
  };

  return (
    <div className="dark p-8 text-xs uppercase">
      <main className="grid h-full grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Shape Selector */}
          <div className="space-y-12">
            <div className="grid grid-cols-2 gap-4">
              <div>
                Grid:
                <br />
                Current: {gridConfig.numRows}x{gridConfig.numCols}
              </div>
              <div>
                <GridControls
                  gridConfig={gridConfig}
                  handleGridConfigChange={handleGridConfigChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                Shapes:
                <br />
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedShape} onValueChange={handleShapeSelect}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a shape" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(shapes).map(([key, shape]) => (
                      <SelectItem key={key} value={key}>
                        {shape.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" onClick={handleAddShape} disabled={!selectedShape}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Shapes List */}
          <div className="space-y-4">
            {activeShapes.map((shape) => (
              <div key={shape.id} className="group">
                <div className="grid grid-cols-8 items-baseline justify-start gap-4">
                  <h3 className="tracking-widest">{shapes[shape.type].label}</h3>
                  <div className={`col-span-7`}>
                    <div
                      className={`grid grid-cols-7 items-baseline gap-4 transition-opacity duration-300 ${openPanels[shape.id]?.animation ? 'opacity-100' : 'opacity-40 focus-within:opacity-100 group-hover:opacity-100'}`}
                    >
                      <div className="col-span-3">
                        <AnimationProperties
                          shape={shape}
                          animationPanelOpen={openPanels[shape.id]?.animation ?? false}
                        />
                      </div>
                      <div className="col-span-2">
                        <AnimationControls
                          shape={shape}
                          handleSpeedChange={handleSpeedChange}
                          handlePauseDurationChange={handlePauseDurationChange}
                          handleEasingChange={handleEasingChange}
                          handleSheetOpenChange={handleSheetOpenChange}
                        />
                      </div>
                      <div className="col-span-2 text-right">
                        <Button
                          className="self-start text-xs"
                          variant="ghost"
                          onClick={() => handleRemoveShape(shape.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div
                      className={`grid grid-cols-7 gap-4 transition-opacity duration-300 ${openPanels[shape.id]?.pattern ? 'opacity-100' : 'opacity-40 focus-within:opacity-100 group-hover:opacity-100'}`}
                    >
                      <div className="col-span-3">
                        <PatternProperties
                          shape={shape}
                          patternPanelOpen={openPanels[shape.id]?.pattern ?? false}
                        />
                      </div>
                      <div className="col-span-4">
                        <PatternControls
                          shape={shape}
                          handleOffsetChange={handleOffsetChange}
                          handlePatternOffsetChange={handlePatternOffsetChange}
                          handleSheetOpenChange={handleSheetOpenChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {activeShapes.length === 0 && <p className="text-3a-white/40">No active shapes</p>}
          </div>
        </div>
        <div className="relative">
          <canvas className="bg-background aspect-square w-full" ref={canvasRef} />
          <svg
            className="pointer-events-none absolute inset-0 aspect-square overflow-visible"
            ref={svgRef}
          />
        </div>
      </main>
    </div>
  );
};

export default Page01;

export const Head: HeadFC = () => <title>Page 01</title>;

function GridControls({
  gridConfig,
  handleGridConfigChange,
}: {
  gridConfig: GridConfig;
  handleGridConfigChange: (key: keyof GridConfig, value: number) => void;
}) {
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
}

function AnimationProperties({
  shape,
  animationPanelOpen,
}: {
  shape: ActiveShape;
  animationPanelOpen: boolean;
}) {
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

function PatternProperties({
  shape,
  patternPanelOpen,
}: {
  shape: ActiveShape;
  patternPanelOpen: boolean;
}) {
  return (
    <dl className={`grid grid-cols-3 gap-x-2 text-xs`}>
      <dt className="col-span-2 text-right">Offset</dt>
      <dd className="text-muted-foreground">{shape.offset} steps</dd>
      <dt className="col-span-2 text-right">Pattern Offset</dt>
      <dd className="text-muted-foreground">{shape.patternOffset ? 'Yes' : 'No'}</dd>
    </dl>
  );
}

function PatternControls({
  shape,
  handleOffsetChange,
  handlePatternOffsetChange,
  handleSheetOpenChange,
}: {
  shape: ActiveShape;
  handleOffsetChange: (shapeId: string, newOffset: number) => void;
  handlePatternOffsetChange: (shapeId: string, newOffset: boolean) => void;
  handleSheetOpenChange: (shapeId: string, panel: 'animation' | 'pattern', isOpen: boolean) => void;
}) {
  return (
    <Sheet onOpenChange={(isOpen) => handleSheetOpenChange(shape.id, 'pattern', isOpen)}>
      <SheetTrigger asChild className="self-start">
        <Button variant="ghost" size="sm">
          Pattern Controls
        </Button>
      </SheetTrigger>
      <SheetContent className="text-xs uppercase" side="bottom">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 items-center gap-4 py-4">
            {/* Position Offset Control */}
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
            {/* Pattern Offset Toggle */}
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

function AnimationControls({
  shape,
  handleSpeedChange,
  handlePauseDurationChange,
  handleEasingChange,
  handleSheetOpenChange,
}: {
  shape: ActiveShape;
  handleSpeedChange: (shapeId: string, newSpeed: number) => void;
  handlePauseDurationChange: (shapeId: string, newDuration: number) => void;
  handleEasingChange: (shapeId: string, newEasing: EasingType) => void;
  handleSheetOpenChange: (shapeId: string, panel: 'animation' | 'pattern', isOpen: boolean) => void;
}) {
  return (
    <Sheet onOpenChange={(isOpen) => handleSheetOpenChange(shape.id, 'animation', isOpen)}>
      <SheetTrigger asChild className="self-start">
        <Button variant="ghost" size="sm">
          Animation Controls
        </Button>
      </SheetTrigger>
      <SheetContent title="Animation Controls" className="text-xs uppercase" side="bottom">
        <div className="grid grid-cols-3 gap-4 py-4">
          {/* Animation Duration Control */}
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
          {/* Pause Duration Control */}
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
          {/* Easing Control */}
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
