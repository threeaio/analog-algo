# Graphics System Documentation

## Overview

The graphics system is built with modularity and performance in mind, following the principles of the Analog Algorithms book. It consists of three main components:

1. Core Canvas Management
2. Grid System
3. Shape System

## Core Canvas Management

### CanvasManager (`graphics/core/canvas-manager.ts`)

- Handles canvas initialization and scaling
- Manages pixel ratio for high DPI displays
- Provides methods for:
  - Canvas size updates
  - Context access
  - Canvas clearing
  - Dimension management

### SceneManager (`graphics/core/scene-manager.ts`)

- Manages the animation loop
- Handles multiple shapes and layers
- Provides methods for:
  - Adding/removing shapes
  - Managing animation frames
  - Updating canvas dimensions
  - Layer management

### DimensionProvider (`graphics/core/dimension-provider.ts`)

- Provides responsive dimensions
- Handles window resize events
- Supports both canvas and element-based dimensions
- Implements debounced resize handling

## Grid System

### GridSystem (`graphics/grid/grid-system.ts`)

- Core grid functionality
- Configurable rows and columns
- Provides:
  - Grid line calculations
  - Cell size management
  - Perimeter point generation
  - Grid dimension updates

### Grid Renderers

Two implementations available:

#### Canvas Renderer (`graphics/grid/grid-renderer.ts`)

- Renders grid using Canvas API
- Supports custom styling
- Optimized for performance

#### SVG Renderer (`graphics/grid/grid-renderer-svg.ts`)

- Renders grid using SVG
- Supports custom styling
- Better for static displays

## Shape System

### BaseShape (`graphics/shapes/base-shape.ts`)

Abstract base class providing:

- Pattern support
- Animation utilities
- Easing functions
- Point interpolation

### PolygonWalker (`graphics/shapes/polygon-walker.ts`)

Specialized shape implementation that:

- Walks vertices along grid perimeter
- Supports various polygon types
- Provides smooth animations
- Handles pattern filling

#### Factory Methods

- `createTriangle`
- `createRectangle`
- `createRegularPolygon`

## Key Features

### Animation

- Smooth transitions between states
- Configurable easing functions
- Pause/resume capabilities
- Delta time-based updates

### Patterns

- Stripe patterns (vertical/horizontal)
- Configurable:
  - Width
  - Gap
  - Color
  - Offset
  - Repetitions

### Performance Optimizations

- High DPI support
- Debounced resize handling
- Efficient canvas clearing
- Layer-based rendering

### Modularity

- Independent components
- Easy to extend
- Reusable across different pages
- Clean separation of concerns

## Usage Example

```typescript
// Initialize core components
const canvas = document.querySelector('canvas');
const canvasManager = new CanvasManager(canvas);
const sceneManager = new SceneManager(canvas);

// Setup grid
const dimensionProvider = new CanvasDimensionProvider(canvas);
const grid = new GridSystem(dimensionProvider, {
  numRows: 8,
  numCols: 8,
  tickHeight: 7,
});

// Create and add shape
const triangle = PolygonWalker.createTriangle(canvasManager.getContext(), grid, {
  color: '#b13',
  animationDuration: 300,
  pauseDuration: 300,
});

sceneManager.addShape(triangle);
sceneManager.start();
```
