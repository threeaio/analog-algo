import type { HeadFC, PageProps } from "gatsby"
import { SceneManager } from "@/canvas/core/scene-manager"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"
import * as React from "react"
import { shapes } from "@/config/shapes"
import { Switch } from "@/components/ui/switch"
import { CanvasDimensionProvider, DimensionProvider, ElementDimensionProvider } from "@/canvas/core/dimension-provider"
import { GridConfig, GridSystem } from "@/canvas/grid/grid-system"
import { GridRendererSvg } from "@/canvas/grid/grid-renderer-svg"
import { EasingType } from "@/canvas/shapes/base-shape"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface ActiveShape {
  id: string;
  type: string;
  speed: number;
  offset: number;
  patternOffset: boolean;
  pauseDuration: number;
  easing: string;
}

const Page01: React.FC<PageProps> = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)
  const sceneRef = React.useRef<SceneManager | null>(null)
  const gridSystemRef = React.useRef<GridSystem | null>(null)
  const dimensionProviderRef = React.useRef<DimensionProvider | null>(null);
  const [activeShapes, setActiveShapes] = React.useState<ActiveShape[]>([])
  const [selectedShape, setSelectedShape] = React.useState<string>("")
  const [gridConfig, setGridConfig] = React.useState<GridConfig>({
    numRows: 8,
    numCols: 8,
    tickHeight: 4
  });

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
      activeShapes.forEach(shape => {
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
    
    setActiveShapes(prev => [...prev, {
      id,
      type: selectedShape,
      speed: defaultSpeed,
      offset: 0,
      patternOffset: false,
      pauseDuration: defaultPauseDuration,
      easing: "linear"
    }]);
  };

  const handleRemoveShape = (shapeId: string) => {
    sceneRef.current?.removeShape(shapeId);
    setActiveShapes(prev => prev.filter(shape => shape.id !== shapeId));
  };

  const handleSpeedChange = (shapeId: string, newSpeed: number) => {
    setActiveShapes(prev => prev.map(shape => 
      shape.id === shapeId ? { ...shape, speed: newSpeed } : shape
    ));
    sceneRef.current?.updateShapeSpeed(shapeId, newSpeed);
  };

  const handleOffsetChange = (shapeId: string, newOffset: number) => {
    setActiveShapes(prev => prev.map(shape => 
      shape.id === shapeId ? { ...shape, offset: newOffset } : shape
    ));
    sceneRef.current?.updateShapeOffset(shapeId, newOffset);
  };

  const handlePatternOffsetChange = (shapeId: string, newOffset: boolean) => {
    setActiveShapes(prev => prev.map(shape => 
      shape.id === shapeId ? { ...shape, patternOffset: newOffset } : shape
    ));
    sceneRef.current?.updateShapePatternOffset(shapeId, newOffset);
  };

  const handlePauseDurationChange = (shapeId: string, newDuration: number) => {
    setActiveShapes(prev => prev.map(shape => 
      shape.id === shapeId ? { ...shape, pauseDuration: newDuration } : shape
    ));
    sceneRef.current?.updateShapePauseDuration(shapeId, newDuration);
  };

  const handleEasingChange = (shapeId: string, newEasing: EasingType) => {
    setActiveShapes(prev => prev.map(shape => 
      shape.id === shapeId ? { ...shape, easing: newEasing } : shape
    ));
    sceneRef.current?.updateShapeEasing(shapeId, newEasing);
  };

  const handleGridConfigChange = (key: keyof GridConfig, value: number) => {
    const newConfig = { ...gridConfig, [key]: value };
    setGridConfig(newConfig);
    gridSystemRef.current?.setConfig(newConfig);
  };

  return (
    <div className="p-8 dark uppercase text-xs">
      <main className="grid grid-cols-2 gap-8 h-full">
        
        <div className="space-y-6">
          {/* Shape Selector */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                Grid-Seeting:<br />
                Current: {gridConfig.numRows}x{gridConfig.numCols}
              </div>
              <div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">[Open Grid Settings]</Button>
                </SheetTrigger>
                <SheetContent className="uppercase" side="bottom">
                  <div className="container mx-auto">
                    <div className="grid grid-cols-3 gap-4 py-4">
                      {/* Rows Control */}
                      <div className="space-y-2">
                        <Label className="truncate text-xs">Rows</Label>
                        <div className="flex gap-4 items-center">
                          <Slider
                            value={[gridConfig.numRows ?? 8]}
                            onValueChange={([value]) => handleGridConfigChange('numRows', value)}
                            min={4}
                            max={32}
                            step={4}
                            className="w-[60%]"
                          />
                          <span className="text-muted-foreground text-xs">
                            {gridConfig.numRows}
                          </span>
                        </div>
                      </div>
                      {/* Columns Control */}
                      <div className="space-y-2">
                        <Label className="truncate text-xs">Columns</Label>
                        <div className="flex gap-4 items-center">
                          <Slider
                            value={[gridConfig.numCols ?? 8]}
                            onValueChange={([value]) => handleGridConfigChange('numCols', value)}
                            min={4}
                            max={32}
                            step={4}
                            className="w-[60%]"
                          />
                          <span className="text-muted-foreground text-xs">
                            {gridConfig.numCols}
                          </span>
                        </div>
                      </div>
                      {/* Tick Height Control */}
                      <div className="space-y-2">
                        <Label className="truncate text-xs">Tick Height</Label>
                        <div className="flex gap-4 items-center">
                          <Slider
                            value={[gridConfig.tickHeight ?? 4]}
                            onValueChange={([value]) => handleGridConfigChange('tickHeight', value)}
                            min={2}
                            max={8}
                            step={1}
                            className="w-[60%]"
                          />
                          <span className="text-muted-foreground text-xs">
                            {gridConfig.tickHeight}px
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                Shape:<br />
              </div>
              <div className="flex gap-2 items-center">
              <Select  value={selectedShape} onValueChange={handleShapeSelect}>
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
              <Button 
                variant="ghost"
                onClick={handleAddShape} 
                disabled={!selectedShape}
              >
                  <span className="text-3a-paper relative -top-[1.5px]">[</span><Plus className="h-4 w-4" /><span className="text-3a-paper relative -top-[1.5px]">]</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Active Shapes List */}
          <div className="space-y-4">
            {activeShapes.map(shape => (
              <div key={shape.id} className="grid grid-cols-2 gap-4  group">
                <div className="flex justify-start items-start gap-4">
                  <h3 className="uppercase font-display tracking-widest">{shapes[shape.type].label}</h3>
                  <div className="text-muted-foreground text-xs opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                    Speed: {shape.speed}ms<br />
                    Pause: {shape.pauseDuration}ms<br />
                    Easing: {shape.easing}<br />
                    Offset: {shape.offset} steps<br />
                    Pattern Offset: {shape.patternOffset ? "Yes" : "No"}
                  </div>
                </div>
                <div className="flex flex-col opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                  <Sheet>
                    <SheetTrigger asChild className="self-start">
                      <Button variant="ghost" size="sm">[Animation Controls]</Button>
                    </SheetTrigger>
                    <SheetContent className="uppercase" side="bottom">
                      <div className="grid grid-cols-3 gap-4 py-4">
                        {/* Animation Duration Control */}
                        <div className="space-y-2">
                          <Label className="truncate text-xs">Animation Duration</Label>
                          <div className="flex gap-4 items-center">
                            <Slider
                              value={[shape.speed]}
                              onValueChange={([value]) => handleSpeedChange(shape.id, value)}
                              min={0}
                              max={1000}
                              step={100}
                              className="w-[60%]"
                            />
                            <span className="text-muted-foreground">
                              {shape.speed}ms
                            </span>
                          </div>
                        </div>
                        {/* Pause Duration Control */}
                        <div className="space-y-2">
                          <Label className="truncate text-xs">Pause Duration</Label>
                          <div className="flex gap-4 items-center">
                            <Slider
                              value={[shape.pauseDuration]}
                              onValueChange={([value]) => handlePauseDurationChange(shape.id, value)}
                              min={0}
                              max={1000}
                              step={100}
                              className="w-[60%]"
                            />
                            <span className="text-muted-foreground">
                              {shape.pauseDuration}ms
                            </span>
                          </div>
                        </div>
                        {/* Easing Control */}
                        <div className="space-y-2">
                          <Label className="truncate text-xs">Easing</Label>
                          <Select value={shape.easing} onValueChange={(value) => handleEasingChange(shape.id, value as EasingType)}>
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

                  <Sheet>
                    <SheetTrigger asChild className="self-start">
                      <Button variant="ghost" size="sm">[Pattern Controls]</Button>
                    </SheetTrigger>
                    <SheetContent className="uppercase" side="bottom">
                    <div className="container mx-auto">
                         <div className="grid grid-cols-2 gap-4 py-4 items-center">
                        {/* Position Offset Control */}
                        <div className="space-y-2">
                          <Label className="truncate text-xs">Position Offset</Label>
                          <div className="flex gap-4 items-center">
                            <Slider
                              value={[shape.offset]}
                              onValueChange={([value]) => handleOffsetChange(shape.id, value)}
                              min={0}
                              max={32}
                              step={1}
                              className="w-[60%]"
                            />
                            <span className="text-muted-foreground text-xs">
                              {shape.offset} steps
                            </span>
                          </div>
                        </div>
                        {/* Pattern Offset Toggle */}
                        <div className="flex items-center space-x-2 cursor-pointer">
                          <Switch
                            checked={shape.patternOffset}
                            onCheckedChange={(checked) => handlePatternOffsetChange(shape.id, checked)}
                          />
                          <Label 
                            className={`text-xs truncate ${shape.patternOffset ? "text-3a-white" : "text-3a-paper"} cursor-pointer`} 
                            onClick={() => handlePatternOffsetChange(shape.id, !shape.patternOffset)}
                          >
                            Pattern Offset
                          </Label>
                        </div>
                      </div></div>
                 
                    </SheetContent>
                  </Sheet>

                  <Button 
                    className="text-3a-paper self-start"
                    variant="ghost"
                    onClick={() => handleRemoveShape(shape.id)}
                  >
                    [remove]
                  </Button>
                </div>
              </div>
            ))}
            {activeShapes.length === 0 && (
              <p className="text-muted-foreground">No active shapes</p>
            )}
          </div>
        </div>
        <div className="relative">
          <canvas
            className="w-full aspect-square bg-background"
            ref={canvasRef}
          />
          <svg
            className="absolute inset-0 aspect-square pointer-events-none overflow-visible"
            ref={svgRef}
          />
        </div>
      </main>
    </div>
  )
}

export default Page01

export const Head: HeadFC = () => <title>Page 01</title>
