import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { SceneManager } from "@/canvas/core/scene-manager"
import { TriangleWalker } from "@/canvas/shapes/triangle-walker"

const Page01: React.FC<PageProps> = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const sceneRef = React.useRef<SceneManager | null>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize scene
    const scene = new SceneManager(canvas);
    
    // Add triangle walker
    const triangle = new TriangleWalker(scene.getContext());
    const triangle2 = new TriangleWalker(scene.getContext(), {offset: 4});
    scene.addShape(triangle);
    scene.addShape(triangle2);
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
