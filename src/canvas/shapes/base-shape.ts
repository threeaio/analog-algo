export interface Point {
  x: number;
  y: number;
}

export abstract class BaseShape {
  protected ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  abstract draw(): void;
  abstract update(deltaTime: number): void;

  protected lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  protected lerpPoint(start: Point, end: Point, t: number): Point {
    return {
      x: this.lerp(start.x, end.x, t),
      y: this.lerp(start.y, end.y, t)
    };
  }
} 