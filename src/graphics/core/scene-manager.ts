import { BaseShape, EasingType } from '../shapes/base-shape';
import { GridSystem, GridConfig } from '../grid/grid-system';
import { CanvasManager } from './canvas-manager';
import { PolygonWalker } from '../shapes/polygon-walker';
import { DimensionProvider, Dimensions } from '@/graphics/core/dimension-provider';



export class SceneManager {
  private canvasManager: CanvasManager;
  public shapes: Map<string, BaseShape> = new Map();
  public layers: Map<string, {draw: () => void}> = new Map();
  // private grid: GridSystem;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement, dimensionProvider: DimensionProvider, gridConfig?: GridConfig) {
    this.canvasManager = new CanvasManager(canvas);
    this.ctx = canvas.getContext('2d')!;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  public updateCanvasSize(dimensions: Dimensions): void {
    this.canvasManager.updateCanvasSize(dimensions);
    this.shapes.forEach((shape) => {
      shape.updateDimensions(dimensions);
    });
  }

  public addLayer(layer: {draw: () => void}): string {
    const id = this.generateId();
    this.layers.set(id, layer);
    return id;
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

  public updateShapeOffset(id: string, offset: number): void {
    const shape = this.shapes.get(id);
    if (shape instanceof PolygonWalker) {
      shape.setOffset(offset);
    }
  }

  public updateShapePatternOffset(id: string, offset: boolean): void {
    const shape = this.shapes.get(id);
    if (shape instanceof PolygonWalker) {
      shape.setPatternOffset(offset);
    }
  }

  public updateShapePauseDuration(id: string, duration: number): void {
    const shape = this.shapes.get(id);
    if (shape instanceof PolygonWalker) {
      shape.setPauseDuration(duration);
    }
  }

  public updateShapeEasing(id: string, easing: EasingType): void {
    const shape = this.shapes.get(id);
    if (shape instanceof PolygonWalker) {
      shape.setEasing(easing);
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

    for (const [_, layer] of this.layers) {
      layer.draw();
    }

    // Draw grid
    // this.grid.draw();

    this.animationFrameId = requestAnimationFrame(this.animate);
  }
} 