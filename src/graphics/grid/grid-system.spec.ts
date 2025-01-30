import { GridSystem } from './grid-system';
import { DimensionProvider } from '../core/dimension-provider';

describe('GridSystem', () => {
  let dimensionProvider: DimensionProvider;
  let gridSystem: GridSystem;
  const fixedWidth = 800;
  const fixedHeight = 600;

  beforeEach(() => {
    dimensionProvider = {
      getDimensions: jest.fn().mockReturnValue({ width: fixedWidth, height: fixedHeight }),
      subscribe: jest.fn().mockReturnValue(() => {}),
      destroy: jest.fn(),
    };
    gridSystem = new GridSystem(dimensionProvider);
  });

  describe('calculatePerimeterIndices', () => {
    describe('8x8 grid (default)', () => {
      it('should return exactly 32 indices (4 edges * 8 points)', () => {
        const indices = gridSystem.calculatePerimeterIndices();
        expect(indices).toHaveLength(32);
      });

      it('should have correct top edge (9 points)', () => {
        const indices = gridSystem.calculatePerimeterIndices();
        const topEdge = indices.slice(0, 8);
        expect(topEdge).toEqual([
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 3, y: 0 },
          { x: 4, y: 0 },
          { x: 5, y: 0 },
          { x: 6, y: 0 },
          { x: 7, y: 0 },
        ]);
      });

      it('should have correct right edge (9 points)', () => {
        const indices = gridSystem.calculatePerimeterIndices();
        const rightEdge = indices.slice(8, 16);
        expect(rightEdge).toEqual([
          { x: 8, y: 0 },
          { x: 8, y: 1 },
          { x: 8, y: 2 },
          { x: 8, y: 3 },
          { x: 8, y: 4 },
          { x: 8, y: 5 },
          { x: 8, y: 6 },
          { x: 8, y: 7 },
        ]);
      });

      it('should have correct bottom edge (9 points)', () => {
        const indices = gridSystem.calculatePerimeterIndices();
        const bottomEdge = indices.slice(16, 24);
        expect(bottomEdge).toEqual([
          { x: 8, y: 8 },
          { x: 7, y: 8 },
          { x: 6, y: 8 },
          { x: 5, y: 8 },
          { x: 4, y: 8 },
          { x: 3, y: 8 },
          { x: 2, y: 8 },
          { x: 1, y: 8 },
        ]);
      });

      it('should have correct left edge (9 points)', () => {
        const indices = gridSystem.calculatePerimeterIndices();
        const leftEdge = indices.slice(24, 32);
        expect(leftEdge).toEqual([
          { x: 0, y: 8 },
          { x: 0, y: 7 },
          { x: 0, y: 6 },
          { x: 0, y: 5 },
          { x: 0, y: 4 },
          { x: 0, y: 3 },
          { x: 0, y: 2 },
          { x: 0, y: 1 },
        ]);
      });
    });

    describe('6x6 grid (reduced by 2)', () => {
      it('should return exactly 24 indices (4 edges * 6 points)', () => {
        const indices = gridSystem.calculatePerimeterIndices({ reduceRows: 2, reduceCols: 2 });
        expect(indices).toHaveLength(24);
      });

      it('should have correct top edge (6 points)', () => {
        const indices = gridSystem.calculatePerimeterIndices({ reduceRows: 2, reduceCols: 2 });
        const topEdge = indices.slice(0, 6);
        expect(topEdge).toEqual([
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
          { x: 3, y: 0 },
          { x: 4, y: 0 },
          { x: 5, y: 0 },
        ]);
      });

      it('should have correct right edge (6 points)', () => {
        const indices = gridSystem.calculatePerimeterIndices({ reduceRows: 2, reduceCols: 2 });
        const rightEdge = indices.slice(6, 12);
        expect(rightEdge).toEqual([
          { x: 6, y: 0 },
          { x: 6, y: 1 },
          { x: 6, y: 2 },
          { x: 6, y: 3 },
          { x: 6, y: 4 },
          { x: 6, y: 5 },
        ]);
      });

      it('should have correct bottom edge (6 points)', () => {
        const indices = gridSystem.calculatePerimeterIndices({ reduceRows: 2, reduceCols: 2 });
        const bottomEdge = indices.slice(12, 18);
        expect(bottomEdge).toEqual([
          { x: 6, y: 6 },
          { x: 5, y: 6 },
          { x: 4, y: 6 },
          { x: 3, y: 6 },
          { x: 2, y: 6 },
          { x: 1, y: 6 },
        ]);
      });

      it('should have correct left edge (6 points)', () => {
        const indices = gridSystem.calculatePerimeterIndices({ reduceRows: 2, reduceCols: 2 });
        const leftEdge = indices.slice(18, 24);
        expect(leftEdge).toEqual([
          { x: 0, y: 6 },
          { x: 0, y: 5 },
          { x: 0, y: 4 },
          { x: 0, y: 3 },
          { x: 0, y: 2 },
          { x: 0, y: 1 },
        ]);
      });
    });

    describe('shifts', () => {
      it('should shift all points by 1 in 8x8 grid', () => {
        const indices = gridSystem.calculatePerimeterIndices({ shiftX: 1, shiftY: 1 });
        expect(indices).toHaveLength(32);

        // Top edge
        const topEdge = indices.slice(0, 8);
        expect(topEdge).toEqual([
          { x: 1, y: 1 },
          { x: 2, y: 1 },
          { x: 3, y: 1 },
          { x: 4, y: 1 },
          { x: 5, y: 1 },
          { x: 6, y: 1 },
          { x: 7, y: 1 },
          { x: 8, y: 1 },
        ]);

        // Right edge
        const rightEdge = indices.slice(8, 16);
        expect(rightEdge).toEqual([
          { x: 9, y: 1 },
          { x: 9, y: 2 },
          { x: 9, y: 3 },
          { x: 9, y: 4 },
          { x: 9, y: 5 },
          { x: 9, y: 6 },
          { x: 9, y: 7 },
          { x: 9, y: 8 },
        ]);
      });

      it('should handle combined reduction and shift (6x6 grid shifted by 2)', () => {
        const indices = gridSystem.calculatePerimeterIndices({ 
          reduceRows: 2, 
          reduceCols: 2,
          shiftX: 2,
          shiftY: 2
        });
        expect(indices).toHaveLength(24);

        // Top edge
        const topEdge = indices.slice(0, 6);
        expect(topEdge).toEqual([
          { x: 2, y: 2 },
          { x: 3, y: 2 },
          { x: 4, y: 2 },
          { x: 5, y: 2 },
          { x: 6, y: 2 },
          { x: 7, y: 2 },
        ]);

        // Right edge
        const rightEdge = indices.slice(6, 12);
        expect(rightEdge).toEqual([
          { x: 8, y: 2 },
          { x: 8, y: 3 },
          { x: 8, y: 4 },
          { x: 8, y: 5 },
          { x: 8, y: 6 },
          { x: 8, y: 7 },
        ]);
      });
    });
  });

  describe('getPerimeterPoints', () => {
    it('should map indices to correct pixel coordinates in 8x8 grid', () => {
      const points = gridSystem.getPerimeterPoints();
      const cellWidth = fixedWidth / 8; // 100px
      const cellHeight = fixedHeight / 8; // 75px
      
      // Test first 3 points of top edge
      expect(points.slice(0, 3)).toEqual([
        { x: 0 * cellWidth, y: 0 * cellHeight },      // (0,0)
        { x: 1 * cellWidth, y: 0 * cellHeight },      // (100,0)
        { x: 2 * cellWidth, y: 0 * cellHeight },      // (200,0)
      ]);

      // Test first 2 points of right edge
      expect(points.slice(8, 10)).toEqual([
        { x: 8 * cellWidth, y: 0 * cellHeight },      // (800,0)
        { x: 8 * cellWidth, y: 1 * cellHeight },      // (800,75)
      ]);
    });

    it('should handle shifts correctly in pixel coordinates', () => {
      const points = gridSystem.getPerimeterPoints({ shiftX: 1, shiftY: 1 });
      const cellWidth = fixedWidth / 8; // 100px
      const cellHeight = fixedHeight / 8; // 75px
      
      // Test first 2 points of shifted top edge
      expect(points.slice(0, 2)).toEqual([
        { x: 1 * cellWidth, y: 1 * cellHeight },      // (100,100)
        { x: 2 * cellWidth, y: 1 * cellHeight },      // (200,100)
      ]);
    });
  });
}); 