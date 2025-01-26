import { BaseShape, Point, PatternConfig, EasingType } from './base-shape';
import { GridSystem, GridConfig } from '../grid/grid-system';
import { Dimensions } from '@/canvas/core/dimension-provider';

interface PolygonConfig {
  gridConfig?: GridConfig;
  color?: string;
  offset?: number;
  pattern?: PatternConfig;
  easing?: EasingType;
  pauseDuration?: number;
  animationDuration?: number;
}

interface VertexIndex {
  index: number;
}

export class PolygonWalker extends BaseShape {
  private vertices: Point[];
  private targetVertices: Point[];
  private startVertices: Point[] | null = null;
  private isAnimating: boolean;
  private animationProgress: number = 0;
  private animationDuration: number;
  private pauseDuration: number;
  private lastPauseTime: number;
  private config: PolygonConfig;
  private grid: GridSystem;
  private initialIndices: VertexIndex[];
  private ticks: number = 0;

  constructor(ctx: CanvasRenderingContext2D, initialIndices: VertexIndex[], grid: GridSystem, config?: PolygonConfig) {
    super(ctx, config?.pattern);
    this.config = config ?? {};
    this.grid = grid;
    this.initialIndices = initialIndices;
    
    this.vertices = this.calculateVertices();
    this.targetVertices = [];
    this.isAnimating = false;
    this.animationDuration = config?.animationDuration ?? 300;
    this.pauseDuration = config?.pauseDuration ?? 300;
    this.lastPauseTime = 0;
  }

  private calculateVertices(offset?: number): Point[] {
    const gridPoints = this.grid.getPerimeterPoints();
    const currentOffset = (offset ?? this.config.offset ?? 0) + this.ticks;
    
    return this.initialIndices.map(({ index }) => {
      const pointIndex = (index + currentOffset) % gridPoints.length;
      return gridPoints[pointIndex];
    });
  }

  private calculateNextVertices(offset: number): Point[] {
    const gridPoints = this.grid.getPerimeterPoints();
    return this.initialIndices.map(({ index }) => {
      const pointIndex = (index + offset + this.ticks) % gridPoints.length;
      return gridPoints[pointIndex];
    });
  }



  public draw(): void {
    const cellSize = this.grid.getCellSize();
    const pattern = this.createStripePattern(cellSize);

    this.ctx.fillStyle = pattern ?? (this.config.color ?? '#b13');
    this.ctx.beginPath();
    this.ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
    
    for (let i = 1; i < this.vertices.length; i++) {
      this.ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    
    this.ctx.closePath();
    this.ctx.fill();
  }

  public setAnimationDuration(duration: number): void {
    this.animationDuration = duration;
  }

  public setOffset(offset: number): void {
    this.config.offset = offset;
    
    // Update current vertices
    this.vertices = this.calculateVertices();

    // Update animation state if needed
    if (this.isAnimating && this.startVertices && this.targetVertices) {
      this.startVertices = this.calculateVertices();
      this.targetVertices = this.calculateNextVertices(offset + 1);
    }
  }

  public setPatternOffset(offset: boolean): void {
    if (this.pattern) {
      this.pattern.patternOffset = offset;
    }
  }

  public updateDimensions(_dimensions: Dimensions): void {
    // Update current vertices
    this.vertices = this.calculateVertices();

    // Update animation state if needed
    if (this.isAnimating && this.startVertices && this.targetVertices) {
      this.startVertices = this.calculateVertices();
      const offset = this.config.offset ?? 0;
      this.targetVertices = this.calculateNextVertices(offset + 1);
    }
  }

  public update(deltaTime: number): void {
    if (!this.isAnimating) {
      const currentTime = performance.now();
      if (currentTime - this.lastPauseTime >= this.pauseDuration) {
        this.moveToNextPoints();
      }
      return;
    }

    this.animationProgress += (deltaTime / this.animationDuration);
    
    if (this.animationProgress >= 1) {
      this.completeAnimation();
      return;
    }

    this.updateVertexPositions();
  }

  private completeAnimation(): void {
    this.updateVertexPositions(1); // Complete the animation at progress 1
    this.animationProgress = 0;
    this.isAnimating = false;
    this.lastPauseTime = performance.now();
    this.startVertices = null;
  }

  private updateVertexPositions(forcedProgress?: number): void {
    if (!this.startVertices) return;
    
    const progress = forcedProgress ?? this.animationProgress;
    const easedProgress = this.ease(progress, this.config.easing);
    
    this.vertices = this.vertices.map((_, i) => {
      const start = this.startVertices![i];
      const target = this.targetVertices[i];
      return this.lerpPoint(start, target, easedProgress);
    });
  }

  private moveToNextPoints(): void {
    if (this.isAnimating) return;
    
    const gridPoints = this.grid.getPerimeterPoints();
    this.startVertices = [...this.vertices];
    
    // Calculate target positions
    this.targetVertices = this.vertices.map((vertex) => {
      const currentIndex = gridPoints.findIndex(p => 
        p.x === vertex.x && p.y === vertex.y
      );
      const nextIndex = (currentIndex + 1) % gridPoints.length;
      return gridPoints[nextIndex];
    });
    
    this.isAnimating = true;
    this.animationProgress = 0;
    this.ticks++;
  }

  // Factory methods
  static createTriangle(ctx: CanvasRenderingContext2D, grid: GridSystem, config?: PolygonConfig): PolygonWalker {
    const numRows = config?.gridConfig?.numRows ?? 8;
    const numCols = config?.gridConfig?.numCols ?? 8;
    
    const initialVertices = [
      { index: 0 },
      { index: numRows },
      { index: numRows + numCols }
    ];
    
    return new PolygonWalker(ctx, initialVertices, grid, config);
  }

  static createRectangle(ctx: CanvasRenderingContext2D, grid: GridSystem, config?: PolygonConfig): PolygonWalker {
    const numRows = config?.gridConfig?.numRows ?? 8;
    const numCols = config?.gridConfig?.numCols ?? 8;
    
    const initialVertices = [
      { index: 0 },
      { index: numCols },
      { index: numRows + numCols },
      { index: numRows * 2 + numCols }
    ];
    
    return new PolygonWalker(ctx, initialVertices, grid, config);
  }

  static createRegularPolygon(
    ctx: CanvasRenderingContext2D, 
    sides: number,
    grid: GridSystem,
    config?: PolygonConfig
  ): PolygonWalker {
    const numRows = config?.gridConfig?.numRows ?? 8;
    const numCols = config?.gridConfig?.numCols ?? 8;
    const totalPoints = (numRows + numCols) * 2;
    const pointsPerSide = Math.floor(totalPoints / sides);
    
    const initialVertices = Array.from(
      { length: sides }, 
      (_, i) => ({ index: (i * pointsPerSide) % totalPoints })
    );
    
    return new PolygonWalker(ctx, initialVertices, grid, config);
  }
} 