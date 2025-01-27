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
import { GridSystem } from "@/canvas/grid/grid-system"
import { GridRendererCanvas } from "@/canvas/grid/grid-renderer"
import { GridRendererSvg } from "@/canvas/grid/grid-renderer-svg"
import { EasingType } from "@/canvas/shapes/base-shape"

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

  return (
    <div className="p-8 dark uppercase text-xs">
      <main className="grid grid-cols-2 gap-8 h-full">
        <div className="space-y-6">
          {/* Shape Selector */}
          <div className="space-y-2">
            <div className="flex gap-2 items-start">
              <Select value={selectedShape} onValueChange={handleShapeSelect}>
                <SelectTrigger className="w-[200px]">
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
                onClick={handleAddShape} 
                disabled={!selectedShape}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Shapes Controls */}
          <div className="space-y-4">
            {activeShapes.map(shape => (
              <div key={shape.id} className="py-4 space-y-4">
                <div className="flex justify-start items-center gap-2">
                  <h3 className="uppercase font-display tracking-widest">{shapes[shape.type].label}</h3>
                  <Button 
                    className="relative top-.5 text-3a-paper"
                    variant="ghost"
                    onClick={() => handleRemoveShape(shape.id)}
                  >
                    {/* <X className="h-4 w-4" /> */}
                    [remove]
                  </Button>
                </div>
                <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                   {/* Speed Control */}
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
                <div className="grid grid-cols-3 gap-4">
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
                      <span className="text-muted-foreground">
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
                    <Label className={`text-xs truncate ${shape.patternOffset ? "text-3a-white" : "text-3a-paper"} cursor-pointer`} onClick={() => handlePatternOffsetChange(shape.id, !shape.patternOffset)}>Pattern Offset</Label>
                  </div>
                </div>

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
            className="w-full aspect-square bg-background "
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
