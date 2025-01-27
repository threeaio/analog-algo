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

interface ActiveShape {
  id: string;
  type: string;
  speed: number;
  offset: number;
  patternOffset: boolean;
}

const Page01: React.FC<PageProps> = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)
  const sceneRef = React.useRef<SceneManager | null>(null)
  const gridSystemRef = React.useRef<GridSystem | null>(null)
  const dimensionProviderRef = React.useRef<DimensionProvider | null>(null);
  const [activeShapes, setActiveShapes] = React.useState<ActiveShape[]>([])
  const [selectedShape, setSelectedShape] = React.useState<string>("")

  // Initialize dimension provider
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const provider = new CanvasDimensionProvider(canvas);
    
    const unsubscribe = provider.subscribe((dimensions) => {
      activeShapes.forEach(shape => {
        const shapeInstance = sceneRef.current?.shapes.get(shape.id);
        if (shapeInstance) {
          shapeInstance.updateDimensions(dimensions);
        }
      });
    });
    dimensionProviderRef.current = provider;
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Initialize grid after dimension provider is set
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dimensionProviderRef.current) return;
    const newGrid = new GridSystem(dimensionProviderRef.current);  
    gridSystemRef.current = newGrid;
  }, []);

  // Initialize scene after both grid and dimension provider are set
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    if (!canvas || !svg || !dimensionProviderRef.current || !gridSystemRef.current) return;

    const scene = new SceneManager(canvas, dimensionProviderRef.current);

    // Initialize both grid renderers
    // const canvasGrid = new GridRendererCanvas(canvas.getContext('2d')!, gridSystemRef.current);
    const svgGrid = new GridRendererSvg(svg, gridSystemRef.current);
    // scene.addLayer(canvasGrid);

    sceneRef.current = scene;
    scene.start();

    const unsubscribe = dimensionProviderRef.current.subscribe((dimensions) => {
      scene.updateCanvasSize(dimensions);
      // Update SVG dimensions
      svg.setAttribute('width', dimensions.width.toString());
      svg.setAttribute('height', dimensions.height.toString());
      svg.setAttribute('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);
    });

    return () => {
      scene.stop();
      unsubscribe();
      svgGrid.destroy();
    };
  }, []);

  const handleShapeSelect = (value: string) => {
    setSelectedShape(value);
  };

  const handleAddShape = () => {
    console.log('grid', gridSystemRef.current);
    console.log('dimensionProvider', dimensionProviderRef.current);
    if (!sceneRef.current || !selectedShape || !gridSystemRef.current) return;
    
    const defaultSpeed = 600;
    const shape = shapes[selectedShape].create(
      sceneRef.current.getContext(), 
      gridSystemRef.current
    );
    const id = sceneRef.current.addShape(shape);
    shape.setAnimationDuration(defaultSpeed);
    
    setActiveShapes(prev => [...prev, {
      id,
      type: selectedShape,
      speed: defaultSpeed,
      offset: 0,
      patternOffset: false
    }]);

    // Reset selection
    // setSelectedShape("");
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

  return (
    <div className="p-8 dark uppercase">
      <main className="grid grid-cols-2 gap-8 h-full">
        <div className="space-y-6">
          {/* Shape Selector */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Add Shape</h2>
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
                    className="relative top-.5"
                    variant="ghost" 
                    onClick={() => handleRemoveShape(shape.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {/* Speed Control */}
                  <div className="space-y-2">
                    <Label>Animation Duration</Label>
                    <div className="flex gap-4 items-center">
                      <Slider
                        value={[shape.speed]}
                        onValueChange={([value]) => handleSpeedChange(shape.id, value)}
                        min={100}
                        max={1000}
                        step={100}
                        className="w-[60%]"
                      />
                      <span className="text-sm text-muted-foreground">
                        {shape.speed}ms
                      </span>
                    </div>
                  </div>

                  {/* Position Offset Control */}
                  <div className="space-y-2">
                    <Label>Position Offset</Label>
                    <div className="flex gap-4 items-center">
                      <Slider
                        value={[shape.offset]}
                        onValueChange={([value]) => handleOffsetChange(shape.id, value)}
                        min={0}
                        max={32}
                        step={1}
                        className="w-[60%]"
                      />
                      <span className="text-sm text-muted-foreground">
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
                    <Label className={`${shape.patternOffset ? "text-3a-white" : "text-3a-paper"} cursor-pointer`} onClick={() => handlePatternOffsetChange(shape.id, !shape.patternOffset)}>Pattern Offset</Label>
                  </div>
                </div>
              </div>
            ))}
            {activeShapes.length === 0 && (
              <p className="text-sm text-muted-foreground">No active shapes</p>
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
