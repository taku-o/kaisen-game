// ゲームフェーズの型（タスク2.1）
export type GamePhase = 'title' | 'placement' | 'battle' | 'result';

// プレイヤーの型（タスク2.1）
export type PlayerType = 'player1' | 'player2';

// 艦の種類の型（タスク2.1）
export type ShipType = 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';

// 艦の向きの型（タスク2.1）
export type Orientation = 'horizontal' | 'vertical';

// 座標の型（タスク2.2）
export type Row = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
export type Col = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface Coordinate {
  row: Row;
  col: Col;
}

// 配置された艦の型（タスク2.3）
export interface PlacedShip {
  type: ShipType;
  coordinates: Coordinate[];
  hits: Coordinate[];
}

// マスの状態の型（タスク2.3）
export type CellState = 'empty' | 'ship' | 'hit' | 'miss' | 'sunk';

// 攻撃記録の型（タスク2.4）
export interface AttackRecord {
  coordinate: Coordinate;
  result: 'hit' | 'miss';
  sunkShip: ShipType | null;
}

// 攻撃結果の型（タスク2.4）
export interface AttackResult {
  coordinate: Coordinate;
  isHit: boolean;
  isSunk: boolean;
  sunkShipType: ShipType | null;
}

// プレイヤーの状態の型（タスク2.5）
export interface PlayerState {
  ships: PlacedShip[];
  attackRecords: AttackRecord[];
}

// ゲーム状態の型（タスク2.5）
export interface GameState {
  phase: GamePhase;
  currentPlayer: PlayerType;
  player1: PlayerState;
  player2: PlayerState;
  winner: PlayerType | null;
}
