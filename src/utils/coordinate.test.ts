import { describe, it, expect } from 'vitest';
import {
  isValidCoordinate,
  coordinateToString,
  stringToCoordinate,
  isSameCoordinate,
} from './coordinate';

describe('coordinate utilities', () => {
  describe('isValidCoordinate', () => {
    it('有効な座標を検証できる', () => {
      expect(isValidCoordinate({ row: 'A', col: 1 })).toBe(true);
      expect(isValidCoordinate({ row: 'J', col: 10 })).toBe(true);
      expect(isValidCoordinate({ row: 'E', col: 5 })).toBe(true);
    });

    it('無効な座標を検出できる', () => {
      expect(isValidCoordinate({ row: 'K' as any, col: 1 })).toBe(false);
      expect(isValidCoordinate({ row: 'A', col: 11 as any })).toBe(false);
      expect(isValidCoordinate({ row: 'A', col: 0 as any })).toBe(false);
    });
  });

  describe('coordinateToString', () => {
    it('座標を文字列に変換できる', () => {
      expect(coordinateToString({ row: 'A', col: 1 })).toBe('A1');
      expect(coordinateToString({ row: 'J', col: 10 })).toBe('J10');
      expect(coordinateToString({ row: 'E', col: 5 })).toBe('E5');
    });
  });

  describe('stringToCoordinate', () => {
    it('文字列を座標に変換できる', () => {
      expect(stringToCoordinate('A1')).toEqual({ row: 'A', col: 1 });
      expect(stringToCoordinate('J10')).toEqual({ row: 'J', col: 10 });
      expect(stringToCoordinate('E5')).toEqual({ row: 'E', col: 5 });
    });

    it('無効な文字列はnullを返す', () => {
      expect(stringToCoordinate('K1')).toBe(null);
      expect(stringToCoordinate('A11')).toBe(null);
      expect(stringToCoordinate('A0')).toBe(null);
      expect(stringToCoordinate('')).toBe(null);
      expect(stringToCoordinate('A')).toBe(null);
    });
  });

  describe('isSameCoordinate', () => {
    it('同じ座標を判定できる', () => {
      expect(isSameCoordinate({ row: 'A', col: 1 }, { row: 'A', col: 1 })).toBe(true);
      expect(isSameCoordinate({ row: 'J', col: 10 }, { row: 'J', col: 10 })).toBe(true);
    });

    it('異なる座標を判定できる', () => {
      expect(isSameCoordinate({ row: 'A', col: 1 }, { row: 'A', col: 2 })).toBe(false);
      expect(isSameCoordinate({ row: 'A', col: 1 }, { row: 'B', col: 1 })).toBe(false);
    });
  });
});
