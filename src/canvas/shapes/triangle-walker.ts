import { BaseShape, Point, PatternConfig, EasingType } from './base-shape';
import { GridSystem, GridConfig } from '../grid/grid-system';

interface TriangleConfig {
  gridConfig?: GridConfig;
  color?: string;
  offset?: number;
  pattern?: PatternConfig;
  easing?: EasingType;
  pauseDuration?: number;
  animationDuration?: number;
}

export class TriangleWalker extends BaseShape {
  private vertices: Point[];
  private targetVertices: Point[];
  private startVertices: Point[] | null = null;
  private isAnimating: boolean;
  private gridPoints: Point[];
  private animationProgress: number = 0;
  private animationDuration: number;
  private pauseDuration: number;
  private lastPauseTime: number;
  private config: TriangleConfig;
  private grid: GridSystem;

  constructor(ctx: CanvasRenderingContext2D, config?: TriangleConfig) {
    super(ctx, config?.pattern);
    this.config = config ?? {};
    this.grid = new GridSystem(ctx, config?.gridConfig);
    this.gridPoints = this.grid.getPerimeterPoints();
    
    const numCols = config?.gridConfig?.numCols ?? 8;
    const numRows = config?.gridConfig?.numRows ?? 8;
    
    this.vertices = [
      this.gridPoints[0 + (this.config.offset ?? 0)], // top-left
      this.gridPoints[numRows + numCols + (this.config.offset ?? 0)], // bottom-right
      this.gridPoints[numRows * 2 + numCols + (this.config.offset ?? 0)] // bottom-left
    ];
    
    this.targetVertices = [];
    this.isAnimating = false;
    this.animationDuration = config?.animationDuration ?? 300; // default 1 second
    this.pauseDuration = config?.pauseDuration ?? 300;
    this.lastPauseTime = 0;
  }

  public draw(): void {
    const cellSize = this.grid.getCellSize();
    const pattern = this.createStripePattern(cellSize);

    this.ctx.fillStyle = pattern ?? (this.config.color ?? '#b13');
    this.ctx.beginPath();
    this.ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
    this.ctx.lineTo(this.vertices[1].x, this.vertices[1].y);
    this.ctx.lineTo(this.vertices[2].x, this.vertices[2].y);
    this.ctx.fill();
  }

  public update(deltaTime: number): void {
    if (!this.isAnimating) {
      const currentTime = performance.now();
      if (currentTime - this.lastPauseTime >= this.pauseDuration) {
        this.moveToNextPoints();
      }
      return;
    }

    // Update animation progress
    this.animationProgress += (deltaTime / this.animationDuration);
    
    if (this.animationProgress >= 1) {
      // Complete the animation exactly at 1
      const easedProgress = this.ease(1, this.config.easing);
      this.vertices = this.vertices.map((vertex, i) => {
        const start = this.startVertices![i];
        const target = this.targetVertices[i];
        return this.lerpPoint(start, target, easedProgress);
      });

      // Reset animation state
      this.animationProgress = 0;
      this.isAnimating = false;
      this.lastPauseTime = performance.now();
      this.startVertices = null;
      return;
    }

    // Apply easing to the progress
    const easedProgress = this.ease(this.animationProgress, this.config.easing);
    
    // Update vertices positions
    this.vertices = this.vertices.map((vertex, i) => {
      const start = this.startVertices![i];
      const target = this.targetVertices[i];
      
      return this.lerpPoint(start, target, easedProgress);
    });
  }

  private moveToNextPoints(): void {
    if (this.isAnimating) return;
    
    // Store start positions
    this.startVertices = [...this.vertices];
    
    // Calculate target positions
    this.targetVertices = this.vertices.map((vertex) => {
      const currentIndex = this.gridPoints.findIndex(p => 
        p.x === vertex.x && p.y === vertex.y
      );
      const nextIndex = (currentIndex + 1) % this.gridPoints.length;
      return this.gridPoints[nextIndex];
    });
    
    this.isAnimating = true;
    this.animationProgress = 0;
  }
} 