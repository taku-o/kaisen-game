import { describe, it, expect } from 'vitest';
import {
  checkHit,
  checkSunk,
  checkAllSunk,
  determineFirstPlayer,
} from './battle';
import type { PlacedShip } from '../types';

describe('battle utilities', () => {
  describe('checkHit', () => {
    const ships: PlacedShip[] = [
      {
        type: 'destroyer',
        coordinates: [{ row: 'A', col: 1 }, { row: 'A', col: 2 }],
        hits: [],
      },
    ];

    it('命中を検出できる', () => {
      const result = checkHit({ row: 'A', col: 1 }, ships);
      expect(result.isHit).toBe(true);
      expect(result.shipType).toBe('destroyer');
    });

    it('ミスを検出できる', () => {
      const result = checkHit({ row: 'B', col: 1 }, ships);
      expect(result.isHit).toBe(false);
      expect(result.shipType).toBe(null);
    });
  });

  describe('checkSunk', () => {
    it('全マス命中で撃沈を判定できる', () => {
      const ship: PlacedShip = {
        type: 'destroyer',
        coordinates: [{ row: 'A', col: 1 }, { row: 'A', col: 2 }],
        hits: [{ row: 'A', col: 1 }, { row: 'A', col: 2 }],
      };
      expect(checkSunk(ship)).toBe(true);
    });

    it('一部命中で撃沈でないと判定できる', () => {
      const ship: PlacedShip = {
        type: 'destroyer',
        coordinates: [{ row: 'A', col: 1 }, { row: 'A', col: 2 }],
        hits: [{ row: 'A', col: 1 }],
      };
      expect(checkSunk(ship)).toBe(false);
    });

    it('命中なしで撃沈でないと判定できる', () => {
      const ship: PlacedShip = {
        type: 'destroyer',
        coordinates: [{ row: 'A', col: 1 }, { row: 'A', col: 2 }],
        hits: [],
      };
      expect(checkSunk(ship)).toBe(false);
    });
  });

  describe('checkAllSunk', () => {
    it('全艦撃沈を判定できる', () => {
      const ships: PlacedShip[] = [
        {
          type: 'destroyer',
          coordinates: [{ row: 'A', col: 1 }, { row: 'A', col: 2 }],
          hits: [{ row: 'A', col: 1 }, { row: 'A', col: 2 }],
        },
        {
          type: 'submarine',
          coordinates: [{ row: 'B', col: 1 }, { row: 'B', col: 2 }, { row: 'B', col: 3 }],
          hits: [{ row: 'B', col: 1 }, { row: 'B', col: 2 }, { row: 'B', col: 3 }],
        },
      ];
      expect(checkAllSunk(ships)).toBe(true);
    });

    it('一部艦が残っている場合はfalseを返す', () => {
      const ships: PlacedShip[] = [
        {
          type: 'destroyer',
          coordinates: [{ row: 'A', col: 1 }, { row: 'A', col: 2 }],
          hits: [{ row: 'A', col: 1 }, { row: 'A', col: 2 }],
        },
        {
          type: 'submarine',
          coordinates: [{ row: 'B', col: 1 }, { row: 'B', col: 2 }, { row: 'B', col: 3 }],
          hits: [{ row: 'B', col: 1 }],
        },
      ];
      expect(checkAllSunk(ships)).toBe(false);
    });
  });

  describe('determineFirstPlayer', () => {
    it('player1またはplayer2を返す', () => {
      const result = determineFirstPlayer();
      expect(['player1', 'player2']).toContain(result);
    });
  });
});
