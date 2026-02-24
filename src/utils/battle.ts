import type { Coordinate, PlacedShip, ShipType, PlayerType } from '../types';
import { isSameCoordinate } from './coordinate';

// 攻撃が命中したか判定する
export function checkHit(
  coordinate: Coordinate,
  targetShips: PlacedShip[]
): { isHit: boolean; shipType: ShipType | null } {
  for (const ship of targetShips) {
    for (const shipCoord of ship.coordinates) {
      if (isSameCoordinate(coordinate, shipCoord)) {
        return { isHit: true, shipType: ship.type };
      }
    }
  }
  return { isHit: false, shipType: null };
}

// 艦が撃沈したか判定する
export function checkSunk(ship: PlacedShip): boolean {
  // 全てのマスが命中していれば撃沈
  return ship.coordinates.every((coord) =>
    ship.hits.some((hit) => isSameCoordinate(coord, hit))
  );
}

// 全艦撃沈か（勝利条件）判定する
export function checkAllSunk(ships: PlacedShip[]): boolean {
  return ships.every((ship) => checkSunk(ship));
}

// 先攻プレイヤーを決定する（ランダム）
export function determineFirstPlayer(): PlayerType {
  return Math.random() < 0.5 ? 'player1' : 'player2';
}

// 艦に命中を記録する
export function recordHit(ships: PlacedShip[], coordinate: Coordinate): PlacedShip[] {
  return ships.map((ship) => {
    const isHitOnThisShip = ship.coordinates.some((coord) =>
      isSameCoordinate(coord, coordinate)
    );
    if (isHitOnThisShip) {
      return {
        ...ship,
        hits: [...ship.hits, coordinate],
      };
    }
    return ship;
  });
}
