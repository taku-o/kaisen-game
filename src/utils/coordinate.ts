import type { Coordinate, Row, Col } from '../types';
import { GRID_ROWS, GRID_COLS } from '../constants';

// 座標が有効か検証する
export function isValidCoordinate(coordinate: Coordinate): boolean {
  return GRID_ROWS.includes(coordinate.row) && GRID_COLS.includes(coordinate.col);
}

// 座標を文字列に変換する（例: {row: 'A', col: 1} → 'A1'）
export function coordinateToString(coordinate: Coordinate): string {
  return `${coordinate.row}${coordinate.col}`;
}

// 文字列を座標に変換する（例: 'A1' → {row: 'A', col: 1}）
export function stringToCoordinate(str: string): Coordinate | null {
  if (str.length < 2 || str.length > 3) {
    return null;
  }

  const row = str[0].toUpperCase() as Row;
  const col = parseInt(str.slice(1), 10) as Col;

  if (!GRID_ROWS.includes(row) || !GRID_COLS.includes(col)) {
    return null;
  }

  return { row, col };
}

// 2つの座標が同じか比較する
export function isSameCoordinate(a: Coordinate, b: Coordinate): boolean {
  return a.row === b.row && a.col === b.col;
}

// 行のインデックスを取得する（A=0, B=1, ...）
export function getRowIndex(row: Row): number {
  return GRID_ROWS.indexOf(row);
}

// 列のインデックスを取得する（1=0, 2=1, ...）
export function getColIndex(col: Col): number {
  return col - 1;
}

// インデックスから行を取得する
export function getRowFromIndex(index: number): Row | null {
  if (index < 0 || index >= GRID_ROWS.length) {
    return null;
  }
  return GRID_ROWS[index];
}

// インデックスから列を取得する
export function getColFromIndex(index: number): Col | null {
  if (index < 0 || index >= GRID_COLS.length) {
    return null;
  }
  return GRID_COLS[index];
}
