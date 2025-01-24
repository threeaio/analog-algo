import { BaseShape } from '../shapes/base-shape';
import { GridSystem, GridConfig } from '../grid/grid-system';
import { CanvasManager } from './canvas-manager';
import { PolygonWalker } from '../shapes/polygon-walker';

export class SceneManager {
  private canvasManager: CanvasManager;
  private shapes: Map<string, BaseShape> = new Map();
  private grid: GridSystem;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement, gridConfig?: GridConfig) {
    this.canvasManager = new CanvasManager(canvas);
    this.grid = new GridSystem(this.canvasManager.getContext(), gridConfig);
    this.ctx = canvas.getContext('2d')!;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  public getContext(): CanvasRenderingContext2D {
    return this.canvasManager.getContext();
  }

  public addShape(shape: BaseShape): string {
    const id = this.generateId();
    this.shapes.set(id, shape);
    return id;
  }

  public removeShape(id: string): boolean {
    return this.shapes.delete(id);
  }

  public clearShapes(): void {
    this.shapes.clear();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public updateAnimationSpeed(duration: number): void {
    for (const [_, shape] of this.shapes) {
      if (shape instanceof PolygonWalker) {
        shape.setAnimationDuration(duration);
      }
    }
  }

  public updateShapeSpeed(id: string, duration: number): void {
    const shape = this.shapes.get(id);
    if (shape instanceof PolygonWalker) {
      shape.setAnimationDuration(duration);
    }
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
    for (const [_, shape] of this.shapes) {
      shape.update(deltaTime);
      shape.draw();
    }

    // Draw grid
    this.grid.draw();

    this.animationFrameId = requestAnimationFrame(this.animate);
  }
} 