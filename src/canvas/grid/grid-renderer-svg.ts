import { GridSystem } from './grid-system';

export interface GridRenderConfigSvg {
  strokeStyle?: string;
  lineWidth?: number;
}

export class GridRendererSvg {
  private svg: SVGSVGElement;
  private grid: GridSystem;
  private config: GridRenderConfigSvg;

  constructor(svg: SVGSVGElement, grid: GridSystem, config?: GridRenderConfigSvg) {
    this.svg = svg;
    this.grid = grid;
    this.config = {
      strokeStyle: config?.strokeStyle ?? '#fff',
      lineWidth: config?.lineWidth ?? 0.5
    };

    // Subscribe to grid changes to trigger redraws
    this.grid.subscribe(() => this.draw());
  }

  public draw(): void {
    // Clear existing lines
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }

    const { horizontal, vertical } = this.grid.getGridLines();
    
    // Draw horizontal lines
    horizontal.forEach(([start, end]) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', start.x.toString());
      line.setAttribute('y1', start.y.toString());
      line.setAttribute('x2', end.x.toString());
      line.setAttribute('y2', end.y.toString());
      line.setAttribute('stroke', this.config.strokeStyle!);
      line.setAttribute('stroke-width', this.config.lineWidth!.toString());
      this.svg.appendChild(line);
    });

    // Draw vertical lines with ticks
    vertical.forEach(points => {
      // Each pair of points represents a line segment
      for (let i = 0; i < points.length; i += 2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', points[i].x.toString());
        line.setAttribute('y1', points[i].y.toString());
        line.setAttribute('x2', points[i + 1].x.toString());
        line.setAttribute('y2', points[i + 1].y.toString());
        line.setAttribute('stroke', this.config.strokeStyle!);
        line.setAttribute('stroke-width', this.config.lineWidth!.toString());
        this.svg.appendChild(line);
      }
    });
  }

  public setConfig(config: Partial<GridRenderConfigSvg>): void {
    this.config = {
      ...this.config,
      ...config
    };
    this.draw();
  }

  public destroy(): void {
    // Clean up any subscriptions or resources
    this.grid.subscribe(() => {});
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }
  }
} 