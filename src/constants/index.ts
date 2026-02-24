import type { ShipType, Row, Col, PlayerState, GameState } from '../types';

// 艦のサイズ定義（タスク3.1）
export const SHIP_SIZES: Record<ShipType, number> = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2,
};

// 艦の日本語名定義（タスク3.1）
export const SHIP_NAMES: Record<ShipType, string> = {
  carrier: '空母',
  battleship: '戦艦',
  cruiser: '巡洋艦',
  submarine: '潜水艦',
  destroyer: '駆逐艦',
};

// 艦種の配列（タスク3.1）
export const SHIP_TYPES: ShipType[] = [
  'carrier',
  'battleship',
  'cruiser',
  'submarine',
  'destroyer',
];

// グリッドの行ラベル（タスク3.2）
export const GRID_ROWS: Row[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

// グリッドの列ラベル（タスク3.2）
export const GRID_COLS: Col[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// グリッドサイズ（タスク3.2）
export const GRID_SIZE = 10;

// 初期プレイヤー状態（タスク3.3）
export const INITIAL_PLAYER_STATE: PlayerState = {
  ships: [],
  attackRecords: [],
};

// 初期ゲーム状態（タスク3.3）
export const INITIAL_GAME_STATE: GameState = {
  phase: 'title',
  currentPlayer: 'player1',
  player1: { ...INITIAL_PLAYER_STATE },
  player2: { ...INITIAL_PLAYER_STATE },
  winner: null,
};
