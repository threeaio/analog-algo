import { BaseShape, EasingType, PatternConfig } from '../shapes/base-shape';
import { CanvasManager } from './canvas-manager';
import { PolygonWalker } from '../shapes/polygon-walker';
import { Dimensions } from '@/graphics/core/dimension-provider';
import { AnimationConfig } from '@/components/shapes/shape-types';

export class SceneManager {
  private canvasManager: CanvasManager;
  public shapes: Map<string, BaseShape> = new Map();
  public layers: Map<string, {draw: () => void}> = new Map();
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
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

  public updateShapeAnimationConfig(id: string, config: Partial<AnimationConfig>): void {
    const shape = this.shapes.get(id);
    if (!(shape instanceof PolygonWalker)) return;

    if (config.speed !== undefined) {
      shape.setAnimationDuration(config.speed);
    }
    if (config.pauseDuration !== undefined) {
      shape.setPauseDuration(config.pauseDuration);
    }
    if (config.easing !== undefined) {
      shape.setEasing(config.easing);
    }
  }

  public updateShapePatternConfig(id: string, config: Partial<PatternConfig>): void {
    const shape = this.shapes.get(id);
    if (!(shape instanceof PolygonWalker)) return;
    
    shape.updatePattern(config);
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

    this.animationFrameId = requestAnimationFrame(this.animate);
  }
} 