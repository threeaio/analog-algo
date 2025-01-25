import { BaseShape, Point, PatternConfig, EasingType } from './base-shape';
import { GridSystem, GridConfig } from '../grid/grid-system';

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
  private gridPoints: Point[];
  private animationProgress: number = 0;
  private animationDuration: number;
  private pauseDuration: number;
  private lastPauseTime: number;
  private config: PolygonConfig;
  private grid: GridSystem;
  private initialIndices: VertexIndex[];

  constructor(ctx: CanvasRenderingContext2D, initialIndices: VertexIndex[], config?: PolygonConfig) {
    super(ctx, config?.pattern);
    this.config = config ?? {};
    this.grid = new GridSystem(ctx, config?.gridConfig);
    this.gridPoints = this.grid.getPerimeterPoints();
    this.initialIndices = initialIndices;
    
    // Apply offset to initial vertices if specified
    const offset = this.config.offset ?? 0;
    this.vertices = initialIndices.map(({ index }) => {
      const pointIndex = (index + offset) % this.gridPoints.length;
      return this.gridPoints[pointIndex];
    });
    
    this.targetVertices = [];
    this.isAnimating = false;
    this.animationDuration = config?.animationDuration ?? 300;
    this.pauseDuration = config?.pauseDuration ?? 300;
    this.lastPauseTime = 0;
  }

  // Factory method for creating a triangle
  static createTriangle(ctx: CanvasRenderingContext2D, config?: PolygonConfig): PolygonWalker {
    const numCols = config?.gridConfig?.numCols ?? 8;
    const numRows = config?.gridConfig?.numRows ?? 8;
    
    // Define indices into the perimeter points array
    const initialVertices = [
      { index: 0 }, // top-left
      { index: numRows }, // bottom-left
      { index: numRows + numCols } // bottom-right
    ];
    
    return new PolygonWalker(ctx, initialVertices, config);
  }

  // Factory method for creating a rectangle
  static createRectangle(ctx: CanvasRenderingContext2D, config?: PolygonConfig): PolygonWalker {
    const numCols = config?.gridConfig?.numCols ?? 8;
    const numRows = config?.gridConfig?.numRows ?? 8;
    
    // Define indices into the perimeter points array
    const initialVertices = [
      { index: 0 }, // top-left
      { index: numCols }, // top-right
      { index: numRows + numCols }, // bottom-right
      { index: numRows * 2 + numCols } // bottom-left
    ];
    
    return new PolygonWalker(ctx, initialVertices, config);
  }

  // Factory method for creating a regular polygon
  static createRegularPolygon(
    ctx: CanvasRenderingContext2D, 
    sides: number,
    config?: PolygonConfig
  ): PolygonWalker {
    const numCols = config?.gridConfig?.numCols ?? 8;
    const numRows = config?.gridConfig?.numRows ?? 8;
    const totalPoints = (numRows + numCols) * 2;
    const pointsPerSide = Math.floor(totalPoints / sides);
    
    const initialVertices = Array.from({ length: sides }, (_, i) => ({
      index: (i * pointsPerSide) % totalPoints
    }));
    
    return new PolygonWalker(ctx, initialVertices, config);
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
    
    // Vertices basierend auf den initialIndices verschieben
    this.vertices = this.initialIndices.map(({ index }) => {
        const pointIndex = (index + offset) % this.gridPoints.length;
        return this.gridPoints[pointIndex];
    });

    // Wenn eine Animation läuft, auch Start- und Zielpunkte entsprechend verschieben
    if (this.isAnimating && this.startVertices && this.targetVertices) {
        this.startVertices = this.initialIndices.map(({ index }) => {
            const pointIndex = (index + offset) % this.gridPoints.length;
            return this.gridPoints[pointIndex];
        });
        
        // Für targetVertices müssen wir den nächsten Punkt berechnen
        this.targetVertices = this.initialIndices.map(({ index }) => {
            const pointIndex = (index + offset + 1) % this.gridPoints.length;
            return this.gridPoints[pointIndex];
        });
    }
  }

  public setPatternOffset(offset: boolean): void {
    if (this.pattern) {
      this.pattern.patternOffset = offset;
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