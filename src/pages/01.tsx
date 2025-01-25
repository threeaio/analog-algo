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

interface ActiveShape {
  id: string;
  type: string;
  speed: number;
  offset: number;
  patternOffset: boolean;
}

const Page01: React.FC<PageProps> = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const sceneRef = React.useRef<SceneManager | null>(null)
  const [activeShapes, setActiveShapes] = React.useState<ActiveShape[]>([])
  const [selectedShape, setSelectedShape] = React.useState<string>("")

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize scene
    const scene = new SceneManager(canvas);
    sceneRef.current = scene;
    
    // Start animation loop
    scene.start();

    return () => {
      scene.stop();
    };
  }, []);

  const handleShapeSelect = (value: string) => {
    setSelectedShape(value);
  };

  const handleAddShape = () => {
    if (!sceneRef.current || !selectedShape) return;
    
    const defaultSpeed = 600;
    const shape = shapes[selectedShape].create(sceneRef.current.getContext());
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
    setSelectedShape("");
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
    <div className="p-8 dark">
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
            <h2 className="text-lg font-semibold">Active Shapes</h2>
            {activeShapes.map(shape => (
              <div key={shape.id} className="py-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{shapes[shape.type].label}</h3>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleRemoveShape(shape.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {/* Speed Control */}
                  <div className="space-y-2">
                    <Label>Speed</Label>
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={shape.patternOffset}
                      onCheckedChange={(checked) => handlePatternOffsetChange(shape.id, checked)}
                    />
                    <Label>Pattern Offset</Label>
                  </div>
                </div>
              </div>
            ))}
            {activeShapes.length === 0 && (
              <p className="text-sm text-muted-foreground">No active shapes</p>
            )}
          </div>
        </div>

        <canvas
          className="w-full aspect-square bg-background"
          ref={canvasRef}
        />
      </main>
    </div>
  )
}

export default Page01

export const Head: HeadFC = () => <title>Page 01</title>
