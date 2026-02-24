import type { Coordinate, ShipType, Orientation, PlacedShip } from '../types';
import { SHIP_SIZES, SHIP_TYPES, GRID_SIZE } from '../constants';
import { getRowIndex, getColIndex, getRowFromIndex, getColFromIndex, isSameCoordinate } from './coordinate';

// 艦の占める座標リストを計算する
export function calculateShipCoordinates(
  startCoordinate: Coordinate,
  shipType: ShipType,
  orientation: Orientation
): Coordinate[] | null {
  const size = SHIP_SIZES[shipType];
  const coordinates: Coordinate[] = [];

  const startRowIndex = getRowIndex(startCoordinate.row);
  const startColIndex = getColIndex(startCoordinate.col);

  for (let i = 0; i < size; i++) {
    let rowIndex: number;
    let colIndex: number;

    if (orientation === 'horizontal') {
      rowIndex = startRowIndex;
      colIndex = startColIndex + i;
    } else {
      rowIndex = startRowIndex + i;
      colIndex = startColIndex;
    }

    // グリッド境界チェック
    if (rowIndex >= GRID_SIZE || colIndex >= GRID_SIZE) {
      return null;
    }

    const row = getRowFromIndex(rowIndex);
    const col = getColFromIndex(colIndex);

    if (row === null || col === null) {
      return null;
    }

    coordinates.push({ row, col });
  }

  return coordinates;
}

// 艦を配置できるか検証する
export function canPlaceShip(
  coordinate: Coordinate,
  shipType: ShipType,
  orientation: Orientation,
  placedShips: PlacedShip[]
): boolean {
  // 座標リストを計算
  const shipCoordinates = calculateShipCoordinates(coordinate, shipType, orientation);

  // グリッド境界を超える場合は配置不可
  if (shipCoordinates === null) {
    return false;
  }

  // 既存の艦との重複チェック
  for (const placedShip of placedShips) {
    for (const placedCoord of placedShip.coordinates) {
      for (const newCoord of shipCoordinates) {
        if (isSameCoordinate(placedCoord, newCoord)) {
          return false;
        }
      }
    }
  }

  return true;
}

// 全ての艦が配置済みか確認する
export function areAllShipsPlaced(placedShips: PlacedShip[]): boolean {
  const placedTypes = new Set(placedShips.map((ship) => ship.type));
  return SHIP_TYPES.every((type) => placedTypes.has(type));
}
