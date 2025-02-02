import type { HeadFC, PageProps } from 'gatsby';
import { SceneManager } from '@/graphics/core/scene-manager';
import * as React from 'react';
import { basePattern, shapes } from '@/config/shapes';
import { CanvasDimensionProvider, DimensionProvider } from '@/graphics/core/dimension-provider';
import { GridConfig, GridSystem } from '@/graphics/grid/grid-system';
import { GridRendererSvg } from '@/graphics/grid/grid-renderer-svg';
import { EasingType } from '@/graphics/shapes/base-shape';
import GridControls from '@/components/grid/grid-controls';
import ShapeSelector from '@/components/shapes/shape-selector';
import ShapeControls from '@/components/shapes/shape-controls';
import {
  ActiveShape,
  OpenPanels,
  AnimationConfig,
  PatternConfig,
  PerimeterConfig,
} from '@/components/shapes/shape-types';
import { PolygonWalker } from '@/graphics/shapes/polygon-walker';

const Page01: React.FC<PageProps> = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const sceneRef = React.useRef<SceneManager | null>(null);
  const gridSystemRef = React.useRef<GridSystem | null>(null);
  const dimensionProviderRef = React.useRef<DimensionProvider | null>(null);
  const [activeShapes, setActiveShapes] = React.useState<ActiveShape[]>([]);
  const [selectedShape, setSelectedShape] = React.useState<string>('');

  const [controlsOpen, setControlsOpen] = React.useState<boolean>(false);

  const [gridConfig, setGridConfig] = React.useState<GridConfig>({
    numRows: 8,
    numCols: 8,
    tickHeight: 4,
  });
  const [openPanels, setOpenPanels] = React.useState<OpenPanels>({});

  // Initialize everything
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    if (!canvas || !svg) return;

    // 1. Initialize dimension provider
    const provider = new CanvasDimensionProvider(canvas);
    dimensionProviderRef.current = provider;

    // 2. Initialize grid system
    const grid = new GridSystem(provider);
    gridSystemRef.current = grid;

    // 3. Initialize scene and grid renderer
    const scene = new SceneManager(canvas);
    const svgGrid = new GridRendererSvg(svg, grid);
    sceneRef.current = scene;
    scene.start();

    // Setup dimension change handlers
    const unsubscribe = provider.subscribe((dimensions) => {
      // Update shapes
      activeShapes.forEach((shape) => {
        const shapeInstance = scene.shapes.get(shape.id);
        if (shapeInstance) {
          shapeInstance.updateDimensions(dimensions);
        }
      });

      // Update canvas/svg size
      scene.updateCanvasSize(dimensions);
      svg.setAttribute('width', dimensions.width.toString());
      svg.setAttribute('height', dimensions.height.toString());
      svg.setAttribute('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);
    });

    return () => {
      scene.stop();
      unsubscribe();
      svgGrid.destroy();
      grid.destroy();
      provider.destroy();
    };
  }, []);

  const handleShapeSelect = (value: string) => {
    setSelectedShape(value);
  };

  const handleAddShape = () => {
    if (!sceneRef.current || !selectedShape || !gridSystemRef.current) return;

    const defaultSpeed = 600;
    const defaultPauseDuration = 300;
    const shape = shapes[selectedShape].create(
      sceneRef.current.getContext(),
      gridSystemRef.current
    );
    const id = sceneRef.current.addShape(shape);
    shape.setAnimationDuration(defaultSpeed);
    shape.setPauseDuration(defaultPauseDuration);

    setActiveShapes((prev) => [
      ...prev,
      {
        id,
        type: selectedShape,
        offset: 0,
        animation: {
          speed: defaultSpeed,
          pauseDuration: defaultPauseDuration,
          easing: 'linear',
        },
        pattern: {
          ...basePattern,
        },
      },
    ]);
  };

  const handleRemoveShape = (shapeId: string) => {
    sceneRef.current?.removeShape(shapeId);
    setActiveShapes((prev) => prev.filter((shape) => shape.id !== shapeId));
  };

  const handleAnimationConfigChange = (shapeId: string, config: Partial<AnimationConfig>) => {
    setActiveShapes((prev) =>
      prev.map((shape) =>
        shape.id === shapeId
          ? {
              ...shape,
              animation: { ...shape.animation, ...config },
            }
          : shape
      )
    );

    sceneRef.current?.updateShapeAnimationConfig(shapeId, config);
  };

  const handlePatternConfigChange = (shapeId: string, config: Partial<PatternConfig>) => {
    setActiveShapes((prev) =>
      prev.map((shape) =>
        shape.id === shapeId
          ? {
              ...shape,
              pattern: { ...shape.pattern, ...config },
            }
          : shape
      )
    );

    sceneRef.current?.updateShapePatternConfig(shapeId, config);
  };

  const handleGridConfigChange = (key: keyof GridConfig, value: number) => {
    const newConfig = { ...gridConfig, [key]: value };
    setGridConfig(newConfig);
    gridSystemRef.current?.setConfig(newConfig);
  };

  const handleSheetOpenChange = (
    shapeId: string,
    panel: 'animation' | 'pattern' | 'shape',
    isOpen: boolean
  ) => {
    setOpenPanels((prev) => ({
      ...prev,
      [shapeId]: {
        ...prev[shapeId],
        [panel]: isOpen,
      },
    }));
  };

  const handleShapeConfigChange = (
    shapeId: string,
    config: {
      offset?: number;
      perimeterConfig?: Partial<PerimeterConfig>;
    }
  ) => {
    setActiveShapes((prev) =>
      prev.map((shape) =>
        shape.id === shapeId
          ? {
              ...shape,
              offset: config.offset ?? shape.offset,
              perimeterConfig: config.perimeterConfig
                ? {
                    ...shape.perimeterConfig,
                    ...config.perimeterConfig,
                  }
                : shape.perimeterConfig,
            }
          : shape
      )
    );

    const shape = sceneRef.current?.shapes.get(shapeId);
    if (shape && shape instanceof PolygonWalker) {
      if (config.offset !== undefined) {
        shape.setOffset(config.offset);
      }
      if (config.perimeterConfig) {
        shape.setPerimeterConfig(config.perimeterConfig);
      }
    }
  };

  return (
    <div className="dark p-8 text-xs uppercase">
      <main className="grid h-full grid-cols-2 gap-8">
        <div className={`space-y-6 transition-all duration-300`}>
          {/* Grid Controls */}
          <div className="space-y-12">
            <div className="grid grid-cols-2 gap-4">
              <div>
                Grid:
                <br />
                Current: {gridConfig.numRows}x{gridConfig.numCols}
              </div>
              <div>
                <GridControls
                  gridConfig={gridConfig}
                  handleGridConfigChange={handleGridConfigChange}
                />
              </div>
            </div>

            {/* Shape Selector */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                Shapes:
                <br />
              </div>
              <ShapeSelector
                selectedShape={selectedShape}
                onShapeSelect={handleShapeSelect}
                onAddShape={handleAddShape}
              />
            </div>
          </div>

          {/* Active Shapes List */}
          <div className="space-y-4">
            {activeShapes.map((shape) => (
              <ShapeControls
                key={shape.id}
                shape={shape}
                grid={gridSystemRef.current!}
                handleControlsOpenChange={setControlsOpen}
                handleAnimationConfigChange={handleAnimationConfigChange}
                handlePatternConfigChange={handlePatternConfigChange}
                handleSheetOpenChange={handleSheetOpenChange}
                handleShapeConfigChange={handleShapeConfigChange}
                handleRemoveShape={handleRemoveShape}
              />
            ))}
            {activeShapes.length === 0 && <p className="text-3a-white/40">No active shapes</p>}
          </div>
        </div>
        <div className="relative">
          <canvas className="bg-background aspect-square w-full" ref={canvasRef} />
          <svg
            className="pointer-events-none absolute inset-0 aspect-square overflow-visible"
            ref={svgRef}
          />
        </div>
      </main>
    </div>
  );
};

export default Page01;

export const Head: HeadFC = () => <title>Page 01</title>;
