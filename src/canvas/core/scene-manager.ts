import { BaseShape } from '../shapes/base-shape';
import { GridSystem, GridConfig } from '../grid/grid-system';
import { CanvasManager } from './canvas-manager';

export class SceneManager {
  private canvasManager: CanvasManager;
  private shapes: BaseShape[] = [];
  private grid: GridSystem;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;

  constructor(canvas: HTMLCanvasElement, gridConfig?: GridConfig) {
    this.canvasManager = new CanvasManager(canvas);
    this.grid = new GridSystem(this.canvasManager.getContext(), gridConfig);
  }

  public getContext(): CanvasRenderingContext2D {
    return this.canvasManager.getContext();
  }

  public addShape(shape: BaseShape) {
    this.shapes.push(shape);
  }

  public start() {
    if (this.animationFrameId === null) {
      this.lastFrameTime = performance.now();
      this.animate();
    }
  }

  public stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private animate = (currentTime: number = 0) => {
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Clear canvas
    this.canvasManager.clear();

    // Update and draw shapes
    for (const shape of this.shapes) {
      shape.update(deltaTime);
      shape.draw();
    }

       // Draw grid
       this.grid.draw();

    this.animationFrameId = requestAnimationFrame(this.animate);
  }
} 