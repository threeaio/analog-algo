import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { SceneManager } from "@/canvas/core/scene-manager"
import { PolygonWalker } from "@/canvas/shapes/polygon-walker"
import { PatternConfig } from "@/canvas/shapes/base-shape"

const Page01: React.FC<PageProps> = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const sceneRef = React.useRef<SceneManager | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize scene
    const scene = new SceneManager(canvas);
    
    const basePattern: PatternConfig = {
      stripeOrientation: 'vertical',
      stripeColor: '#c13',
      stripeDivisions: 16,
    }

    // Create triangle with fast linear movement
    const triangle = PolygonWalker.createTriangle(scene.getContext(), {
      pattern: { ...basePattern },
      animationDuration: 200,
      pauseDuration: 0,
      easing: 'linear'
    });

    const rectangle = PolygonWalker.createRectangle(scene.getContext(), {
      pattern: { ...basePattern, patternOffset: true },
      offset: 4,
      animationDuration: 600,
      pauseDuration: 200,
      easing: 'easeOut'
    });

    const pentagon = PolygonWalker.createRegularPolygon(scene.getContext(), 7, {
      pattern: { ...basePattern, patternOffset: true },
      offset: 9,
      animationDuration: 800,
      pauseDuration: 400,
      easing: 'easeIn'
    });

    const pentagon2 = PolygonWalker.createRegularPolygon(scene.getContext(), 7, {
      pattern: { ...basePattern, patternOffset: false },
      offset: 0,
      animationDuration: 800,
      pauseDuration: 400,
      easing: 'easeIn'
    });

    // Add shapes to scene
    // scene.addShape(triangle);
    // scene.addShape(rectangle);
    scene.addShape(pentagon);
    scene.addShape(pentagon2);
    // Start animation
    scene.start();
    
    // Store scene reference
    sceneRef.current = scene;

    // Cleanup
    return () => {
      if (sceneRef.current) {
        sceneRef.current.stop();
      }
    };
  }, []);

  return (
    <main className="p-24 font-sans flex justify-center items-center">
      <canvas
        className="w-1/2 aspect-square"
        ref={canvasRef}
      />
    </main>
  )
}

export default Page01

export const Head: HeadFC = () => <title>Page 01</title>
