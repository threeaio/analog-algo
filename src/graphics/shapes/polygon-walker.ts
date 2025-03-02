import { BaseShape, Point, PatternConfig, EasingType } from './base-shape';
import { GridSystem, GridConfig, PerimeterConfig, PerimeterLimits } from '../grid/grid-system';
import { Dimensions } from '@/graphics/core/dimension-provider';

interface PolygonConfig {
  gridConfig?: GridConfig;
  color?: string;
  offset?: number;
  pattern?: PatternConfig;
  easing?: EasingType;
  pauseDuration?: number;
  animationDuration?: number;
  perimeterConfig?: PerimeterConfig;
}

interface VertexIndex {
  index: number;
}

type IndicesCalculator = (gridConfig: GridConfig) => VertexIndex[];

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
  private calculateIndices: IndicesCalculator;
  private ticks: number = 0;

  constructor(
    ctx: CanvasRenderingContext2D, 
    calculateIndices: IndicesCalculator,
    grid: GridSystem, 
    config?: PolygonConfig
  ) {
    super(ctx, config?.pattern);
    this.config = config ?? {};
    this.grid = grid;
    this.calculateIndices = calculateIndices;
    
    this.vertices = this.calculateVertices();
    this.targetVertices = [];
    this.isAnimating = false;
    this.animationDuration = config?.animationDuration ?? 300;
    this.pauseDuration = config?.pauseDuration ?? 300;
    this.lastPauseTime = 0;

    this.grid.subscribe(() => {
            // Update current vertices
      const offset = this.config?.offset?? 0;
      this.vertices = this.calculateVertices();

      // Update animation state if needed
      if (this.isAnimating && this.startVertices && this.targetVertices) {
        this.startVertices = this.calculateVertices(offset);
        this.targetVertices = this.calculateNextVertices(offset + 1);
      }
    })
  }

  private calculateVertices(offset?: number): Point[] {
    const gridPoints = this.grid.getPerimeterPoints(this.config.perimeterConfig);


    const currentOffset = (offset ?? this.config.offset ?? 0) + this.ticks;
    const gridConfig = this.grid.getConfig();
    
    return this.calculateIndices(gridConfig).map(({ index }) => {
      const pointIndex = (index + currentOffset) % gridPoints.length;
      return gridPoints[pointIndex];
    });
  }

  private calculateNextVertices(offset: number): Point[] {
    const gridPoints = this.grid.getPerimeterPoints(this.config.perimeterConfig);
    const gridConfig = this.grid.getConfig();
    
    return this.calculateIndices(gridConfig).map(({ index }) => {
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

  public updatePattern(config: Partial<PatternConfig>): void {
    if (!this.pattern) {
      this.pattern = {
        stripeOrientation: 'vertical',
        stripeColor: 'redDark',
        stripeWidth: 1,
        stripeGap: 1,
        stripeOffset: 0,
        patternOffset: false,
        repetitions: 1,
        ...config
      };
    } else {
      Object.assign(this.pattern, config);
    }
  }

  public setPauseDuration(duration: number): void {
    this.pauseDuration = duration;
  }

  public setEasing(easing: EasingType): void {
    this.config.easing = easing;
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
    
    const gridPoints = this.grid.getPerimeterPoints(this.config.perimeterConfig);
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

  public setPerimeterConfig(config: Partial<PerimeterConfig>): void {
    this.config.perimeterConfig = {
      ...this.config.perimeterConfig,
      ...config
    };
    
    // Update current vertices
    this.vertices = this.calculateVertices();

    // Update animation state if needed
    if (this.isAnimating && this.startVertices && this.targetVertices) {
      this.startVertices = this.calculateVertices();
      const offset = this.config.offset ?? 0;
      this.targetVertices = this.calculateNextVertices(offset + 1);
    }
  }

  public getPerimeterLimits(): PerimeterLimits {
    return this.grid.getPerimeterLimits(this.config.perimeterConfig);
  }

  // Factory methods
  static createTriangle(ctx: CanvasRenderingContext2D, grid: GridSystem, config?: PolygonConfig): PolygonWalker {
    const calculateTriangleIndices = (gridConfig: GridConfig): VertexIndex[] => {
      const { rows, cols } = grid.getEffectiveDimensions(config?.perimeterConfig);
      const totalPoints = (rows + cols) * 2;
      
      return [
        { index: 0 },                    // top-left
        { index: Math.floor(totalPoints / 3) },  // first third
        { index: Math.floor(totalPoints * 2 / 3) } // second third
      ];
    };
    
    return new PolygonWalker(ctx, calculateTriangleIndices, grid, config);
  }

  static createRectangle(ctx: CanvasRenderingContext2D, grid: GridSystem, config?: PolygonConfig): PolygonWalker {
    const calculateRectangleIndices = (gridConfig: GridConfig): VertexIndex[] => {
      const { rows, cols } = grid.getEffectiveDimensions(config?.perimeterConfig);
      const totalPoints = (rows + cols) * 2;
      
      return [
        { index: 0 },                     // top-left
        { index: Math.floor(totalPoints / 4) },   // first quarter
        { index: Math.floor(totalPoints / 2) },   // halfway
        { index: Math.floor(totalPoints * 3 / 4) } // third quarter
      ];
    };
    
    return new PolygonWalker(ctx, calculateRectangleIndices, grid, config);
  }

  static createRegularPolygon(
    ctx: CanvasRenderingContext2D, 
    sides: number,
    grid: GridSystem,
    config?: PolygonConfig
  ): PolygonWalker {
    const calculateRegularPolygonIndices = (gridConfig: GridConfig): VertexIndex[] => {
      const { rows, cols } = grid.getEffectiveDimensions(config?.perimeterConfig);
      const totalPoints = (rows + cols) * 2;
      const pointsPerSide = Math.floor(totalPoints / sides);
      
      return Array.from(
        { length: sides }, 
        (_, i) => ({ index: (i * pointsPerSide) % totalPoints })
      );
    };
    
    return new PolygonWalker(ctx, calculateRegularPolygonIndices, grid, config);
  }
} 