export interface Dimensions {
  width: number;
  height: number;
}

export interface DimensionProvider {
  getDimensions(): Dimensions;
  subscribe(callback: (dimensions: Dimensions) => void): () => void;
  destroy(): void;
}

abstract class BaseDimensionProvider implements DimensionProvider {
  protected subscribers: ((dimensions: Dimensions) => void)[] = [];
  protected resizeObserver: ResizeObserver;
  private debounceTimeout: number | null = null;
  private readonly DEBOUNCE_DELAY = 150; // ms

  constructor(protected element: HTMLElement) {
    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.resizeObserver.observe(element);
  }

  protected handleResize = () => {
    // Clear any existing timeout
    if (this.debounceTimeout !== null) {
      window.clearTimeout(this.debounceTimeout);
    }

    // Set new timeout
    this.debounceTimeout = window.setTimeout(() => {
      const dimensions = this.getDimensions();
      this.subscribers.forEach(callback => callback(dimensions));
      this.debounceTimeout = null;
    }, this.DEBOUNCE_DELAY);
  };
  

  public getDimensions(): Dimensions {
    const rect = this.element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    };
  }

  public subscribe(callback: (dimensions: Dimensions) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  public destroy() {
    this.resizeObserver.disconnect();
    this.subscribers = [];
    if (this.debounceTimeout !== null) {
      window.clearTimeout(this.debounceTimeout);
    }
  }
}

export class CanvasDimensionProvider extends BaseDimensionProvider {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }
}

export class ElementDimensionProvider extends BaseDimensionProvider {
  constructor(element: HTMLElement) {
    super(element);
  }
} 