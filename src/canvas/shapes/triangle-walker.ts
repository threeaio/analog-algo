import { BaseShape, Point } from './base-shape';
import { GridSystem, GridConfig } from '../grid/grid-system';

export class TriangleWalker extends BaseShape {
  private vertices: Point[];
  private targetVertices: Point[];
  private isAnimating: boolean;
  private gridPoints: Point[];
  private animationSpeed: number;
  private pauseDuration: number;
  private lastPauseTime: number;
  private config: {
    gridConfig?: GridConfig,
    color?: string,
    offset?: number
  } | undefined;

  constructor(ctx: CanvasRenderingContext2D, config?: {
    gridConfig?: GridConfig,
    color?: string
    offset?: number
  }) {
    super(ctx);
    this.config = config;
    const grid = new GridSystem(ctx, config?.gridConfig);
    this.gridPoints = grid.getPerimeterPoints();
    
    // Initialize triangle vertices at specific positions:
    // First point (0): top-left
    // Second point (numRows): bottom-left
    // Third point (numRows + numCols): bottom-right
    const numCols = config?.gridConfig?.numCols ?? 8;
    const numRows = config?.gridConfig?.numRows ?? 8;
    
    this.vertices = [
      this.gridPoints[0 + (this.config?.offset ?? 0)], // top-left
      this.gridPoints[numRows + numCols + (this.config?.offset ?? 0)], // bottom-rght
      this.gridPoints[numRows * 2 + numCols + (this.config?.offset ?? 0)] // bottom-left
    ];
    
    this.targetVertices = [];
    this.isAnimating = false;
    this.animationSpeed = 0.1;
    this.pauseDuration = 0.1;
    this.lastPauseTime = 0;
  }

  public draw(): void {
    this.ctx.fillStyle = this.config?.color ?? '#b13';
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

    let allArrived = true;
    
    this.vertices = this.vertices.map((vertex, i) => {
      const target = this.targetVertices[i];
      const dx = target.x - vertex.x;
      const dy = target.y - vertex.y;
      
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        allArrived = false;
        return {
          x: vertex.x + dx * this.animationSpeed,
          y: vertex.y + dy * this.animationSpeed
        };
      }
      return target;
    });

    if (allArrived) {
      this.isAnimating = false;
      this.lastPauseTime = performance.now();
    }
  }

  private moveToNextPoints(): void {
    if (this.isAnimating) return;
    
    this.targetVertices = this.vertices.map((vertex) => {
      const currentIndex = this.gridPoints.findIndex(p => 
        p.x === vertex.x && p.y === vertex.y
      );
      const nextIndex = (currentIndex + 1) % this.gridPoints.length;
      return this.gridPoints[nextIndex];
    });
    
    this.isAnimating = true;
  }
} 