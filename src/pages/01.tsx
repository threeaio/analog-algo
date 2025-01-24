import type { HeadFC, PageProps } from "gatsby"
import { SceneManager } from "@/canvas/core/scene-manager"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import * as React from "react"
import { shapes } from "@/config/shapes"

const Page01: React.FC<PageProps> = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const sceneRef = React.useRef<SceneManager | null>(null)
  const [animationSpeed, setAnimationSpeed] = React.useState(200)
  const [activeShapes, setActiveShapes] = React.useState<Record<string, string>>({})

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

  const handleToggleShape = (shapeKey: string) => {
    if (activeShapes[shapeKey]) {
      // Remove shape
      sceneRef.current?.removeShape(activeShapes[shapeKey]);
      setActiveShapes(prev => {
        const next = { ...prev };
        delete next[shapeKey];
        return next;
      });
    } else {
      // Add shape
      const shape = shapes[shapeKey].create(sceneRef.current!.getContext(), animationSpeed);
      const id = sceneRef.current?.addShape(shape);
      if (id) {
        setActiveShapes(prev => ({
          ...prev,
          [shapeKey]: id
        }));
      }
    }
  };

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setAnimationSpeed(newSpeed);
    // Update speed for all existing shapes
    sceneRef.current?.updateAnimationSpeed(newSpeed);
  };

  return (
    <div className="p-8 dark">
      <main className="grid grid-cols-2 gap-8 h-full">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Shapes</h2>
            {Object.entries(shapes).map(([key, shape]) => (
              <div key={key} className="flex items-center space-x-2">
                <Switch
                  checked={!!activeShapes[key]}
                  onCheckedChange={() => handleToggleShape(key)}
                />
                <Label>{shape.label}</Label>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Animation Speed</h2>
            <Slider
              value={[animationSpeed]}
              onValueChange={handleSpeedChange}
              min={100}
              max={1000}
              step={100}
              className="w-[60%]"
            />
            <div className="text-sm text-muted-foreground">
              {animationSpeed}ms per movement
            </div>
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
