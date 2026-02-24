import { describe, it, expect } from 'vitest';
import {
  calculateShipCoordinates,
  canPlaceShip,
  areAllShipsPlaced,
} from './placement';
import type { PlacedShip } from '../types';

describe('placement utilities', () => {
  describe('calculateShipCoordinates', () => {
    it('水平方向に艦の座標を計算できる', () => {
      const coords = calculateShipCoordinates({ row: 'A', col: 1 }, 'destroyer', 'horizontal');
      expect(coords).toEqual([
        { row: 'A', col: 1 },
        { row: 'A', col: 2 },
      ]);
    });

    it('垂直方向に艦の座標を計算できる', () => {
      const coords = calculateShipCoordinates({ row: 'A', col: 1 }, 'cruiser', 'vertical');
      expect(coords).toEqual([
        { row: 'A', col: 1 },
        { row: 'B', col: 1 },
        { row: 'C', col: 1 },
      ]);
    });

    it('グリッド境界を超える場合はnullを返す', () => {
      expect(calculateShipCoordinates({ row: 'A', col: 9 }, 'cruiser', 'horizontal')).toBe(null);
      expect(calculateShipCoordinates({ row: 'I', col: 1 }, 'cruiser', 'vertical')).toBe(null);
    });
  });

  describe('canPlaceShip', () => {
    it('空のグリッドに配置できる', () => {
      expect(canPlaceShip({ row: 'A', col: 1 }, 'destroyer', 'horizontal', [])).toBe(true);
    });

    it('既存の艦と重ならなければ配置できる', () => {
      const placedShips: PlacedShip[] = [
        {
          type: 'destroyer',
          coordinates: [{ row: 'A', col: 1 }, { row: 'A', col: 2 }],
          hits: [],
        },
      ];
      expect(canPlaceShip({ row: 'B', col: 1 }, 'cruiser', 'horizontal', placedShips)).toBe(true);
    });

    it('既存の艦と重なる場合は配置できない', () => {
      const placedShips: PlacedShip[] = [
        {
          type: 'destroyer',
          coordinates: [{ row: 'A', col: 1 }, { row: 'A', col: 2 }],
          hits: [],
        },
      ];
      expect(canPlaceShip({ row: 'A', col: 2 }, 'cruiser', 'horizontal', placedShips)).toBe(false);
    });

    it('グリッド境界を超える場合は配置できない', () => {
      expect(canPlaceShip({ row: 'A', col: 10 }, 'destroyer', 'horizontal', [])).toBe(false);
    });
  });

  describe('areAllShipsPlaced', () => {
    it('全艦配置済みの場合はtrueを返す', () => {
      const placedShips: PlacedShip[] = [
        { type: 'carrier', coordinates: [], hits: [] },
        { type: 'battleship', coordinates: [], hits: [] },
        { type: 'cruiser', coordinates: [], hits: [] },
        { type: 'submarine', coordinates: [], hits: [] },
        { type: 'destroyer', coordinates: [], hits: [] },
      ];
      expect(areAllShipsPlaced(placedShips)).toBe(true);
    });

    it('艦が不足している場合はfalseを返す', () => {
      const placedShips: PlacedShip[] = [
        { type: 'carrier', coordinates: [], hits: [] },
        { type: 'battleship', coordinates: [], hits: [] },
      ];
      expect(areAllShipsPlaced(placedShips)).toBe(false);
    });

    it('艦がない場合はfalseを返す', () => {
      expect(areAllShipsPlaced([])).toBe(false);
    });
  });
});
