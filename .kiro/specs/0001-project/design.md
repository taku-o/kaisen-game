# 海戦ゲーム 設計書

## 1. アーキテクチャ概要

### 1.1 SPAアーキテクチャ

本アプリケーションはSingle Page Application（SPA）として実装する。サーバーサイドは不要で、クライアントサイドで全てのゲームロジックを処理する。

### 1.2 画面遷移フロー

```
┌─────────────────┐
│   タイトル画面   │
│  TitleScreen    │
└────────┬────────┘
         │ ゲーム開始ボタンクリック (1-3)
         ▼
┌─────────────────┐
│   配置画面       │
│  PlacementScreen │◄──┐
│  (Player 1)     │    │ Player 1 配置確定 (2-12)
└────────┬────────┘    │
         │             │
         ▼             │
┌─────────────────┐    │
│   配置画面       │────┘
│  PlacementScreen │
│  (Player 2)     │
└────────┬────────┘
         │ Player 2 配置確定 (2-13)
         ▼
┌─────────────────┐
│   対戦画面       │◄──┐
│  BattleScreen   │    │ ターン交代 (3-11, 3-12)
└────────┬────────┴────┘
         │ 勝者決定 (4-2, 4-3)
         ▼
┌─────────────────┐
│   結果画面       │
│  ResultScreen   │
└────────┬────────┘
         │ タイトルに戻る (5-3)
         ▼
┌─────────────────┐
│   タイトル画面   │
│  TitleScreen    │
└─────────────────┘
```

### 1.3 状態管理の方針

- ゲーム全体の状態を単一のState（GameState）で管理する
- Reactの`useState`フックを使用して状態管理を行う
- 画面遷移はGameStateの`phase`プロパティで制御する
- useEffectの使用は最小限に抑える

---

## 2. 技術スタック

| カテゴリ | 技術 | バージョン | 用途 |
|----------|------|------------|------|
| フレームワーク | React | 18.x | UIコンポーネント構築 |
| 言語 | TypeScript | 5.x | 型安全なコード記述 |
| ビルドツール | Vite | 5.x | 高速な開発サーバーとビルド |
| テスト | Vitest | - | ユニットテスト |
| E2Eテスト | Playwright | - | 画面描画テスト |
| リンター | ESLint | - | コード品質維持 |
| フォーマッター | Prettier | - | コード整形 |

---

## 3. コンポーネント設計

### 3.1 App（ルートコンポーネント）

#### 責務
- ゲーム全体の状態（GameState）を保持・管理する
- 現在のフェーズ（phase）に応じて表示する画面を切り替える
- 各画面コンポーネントに必要なpropsと状態更新関数を渡す

#### Props/State インターフェース

```typescript
// Appコンポーネントの内部状態
interface AppState {
  gameState: GameState;
}

// Appコンポーネントにpropsは不要（ルートコンポーネントのため）
```

#### 要件トレーサビリティ
- 6-1: 4画面構成の制御

---

### 3.2 TitleScreen（タイトル画面）

#### 責務
- ゲームタイトルを表示する
- ゲーム開始ボタンを表示する
- ゲーム開始ボタンクリック時に配置画面への遷移を通知する

#### Props/State インターフェース

```typescript
interface TitleScreenProps {
  onStartGame: () => void;
}
```

#### 要件トレーサビリティ
- 1-1: ゲームタイトル表示
- 1-2: ゲーム開始ボタン表示
- 1-3: ゲーム開始ボタンクリックで配置画面へ遷移

---

### 3.3 PlacementScreen（配置画面）

#### 責務
- 現在のプレイヤー（Player 1 / Player 2）を表示する
- 10×10グリッドを表示する
- 配置する艦の一覧を表示する
- 艦の向き（水平/垂直）を切り替える機能を提供する
- グリッド上のマスクリックで艦を配置する
- 配置ルールのバリデーションを行う
- 配置確定ボタンを表示し、有効/無効を制御する
- 配置確定時に次のフェーズへの遷移を通知する

#### Props/State インターフェース

```typescript
interface PlacementScreenProps {
  currentPlayer: PlayerType;
  onPlacementConfirm: (ships: PlacedShip[]) => void;
}

interface PlacementScreenState {
  placedShips: PlacedShip[];
  selectedShipType: ShipType | null;
  orientation: Orientation;
}
```

#### 要件トレーサビリティ
- 2-1: 10×10グリッド表示
- 2-2: 艦の一覧表示
- 2-3: 現在のプレイヤー表示
- 2-4: 艦の向き切り替え機能
- 2-5: 配置確定ボタン表示
- 2-6: グリッドクリックで艦配置
- 2-7: 艦の向き切り替え操作
- 2-8: 境界線超え配置の禁止
- 2-9: 艦の重複配置の禁止
- 2-10: 全艦配置で確定ボタン有効化
- 2-11: 艦未配置で確定ボタン無効化
- 2-12: Player 1配置確定でPlayer 2配置画面へ
- 2-13: Player 2配置確定で対戦画面へ

---

### 3.4 BattleScreen（対戦画面）

#### 責務
- 攻撃記録グリッド（相手への攻撃結果）を表示する
- 自陣グリッド（自分の艦と被弾状況）を表示する
- 現在のターン（Player 1 / Player 2）を表示する
- 攻撃結果メッセージ（命中 / ミス / 撃沈）を表示する
- 両プレイヤーの残存艦の状況を表示する
- 攻撃処理を実行し、命中/ミスを判定する
- 撃沈判定を行う
- 勝敗判定を行い、勝者決定時に結果画面への遷移を通知する
- ターン交代時に画面切り替え（相手配置を隠す）を行う

#### Props/State インターフェース

```typescript
interface BattleScreenProps {
  player1Ships: PlacedShip[];
  player2Ships: PlacedShip[];
  initialTurn: PlayerType;
  onGameEnd: (winner: PlayerType) => void;
}

interface BattleScreenState {
  currentTurn: PlayerType;
  player1Attacks: AttackRecord[];
  player2Attacks: AttackRecord[];
  lastAttackResult: AttackResult | null;
  isTransitioning: boolean;
}
```

#### 要件トレーサビリティ
- 3-1: 攻撃記録グリッド表示
- 3-2: 自陣グリッド表示
- 3-3: 現在のターン表示
- 3-4: 残存艦の状況表示
- 3-5: 未攻撃マスクリックで攻撃実行
- 3-6: ミス表示
- 3-7: 命中表示
- 3-8: 攻撃結果メッセージ表示
- 3-9: 撃沈メッセージ表示
- 3-10: 攻撃済みマス再攻撃禁止
- 3-11: ターン交代
- 3-12: ターン交代時の画面切り替え
- 4-1: 撃沈判定
- 4-2: 勝者判定
- 4-3: 結果画面への遷移

---

### 3.5 ResultScreen（結果画面）

#### 責務
- 勝者（Player 1 / Player 2）を表示する
- タイトルに戻るボタンを表示する
- タイトルに戻るボタンクリック時にタイトル画面への遷移を通知する

#### Props/State インターフェース

```typescript
interface ResultScreenProps {
  winner: PlayerType;
  onReturnToTitle: () => void;
}
```

#### 要件トレーサビリティ
- 5-1: 勝者表示
- 5-2: タイトルに戻るボタン表示
- 5-3: タイトルに戻るボタンクリックでタイトル画面へ遷移

---

### 3.6 Grid（グリッド表示）

#### 責務
- 10×10のグリッドを表示する
- 縦軸ラベル（A〜J）と横軸ラベル（1〜10）を表示する
- 各マス（Cell）を配置する
- マスクリックイベントを親コンポーネントに伝達する

#### Props/State インターフェース

```typescript
interface GridProps {
  cells: CellState[][];
  onCellClick: (coordinate: Coordinate) => void;
  disabled?: boolean;
}
```

#### 要件トレーサビリティ
- 2-1: 10×10グリッド表示
- 3-1: 攻撃記録グリッド表示
- 3-2: 自陣グリッド表示

---

### 3.7 Cell（マス）

#### 責務
- 1つのマスを表示する
- マスの状態（空、艦あり、命中、ミス）に応じた表示を行う
- クリックイベントを親コンポーネントに伝達する

#### Props/State インターフェース

```typescript
interface CellProps {
  state: CellState;
  coordinate: Coordinate;
  onClick: (coordinate: Coordinate) => void;
  disabled?: boolean;
}
```

#### 要件トレーサビリティ
- 2-6: マスクリックで艦配置
- 3-5: マスクリックで攻撃
- 3-6: ミス表示
- 3-7: 命中表示

---

### 3.8 Ship（艦表示）

#### 責務
- 艦の情報（艦種、サイズ）を表示する
- 配置済み/未配置の状態を表示する
- 撃沈状態を表示する

#### Props/State インターフェース

```typescript
interface ShipProps {
  shipType: ShipType;
  isPlaced: boolean;
  isSunk: boolean;
}
```

#### 要件トレーサビリティ
- 2-2: 配置する艦の一覧表示
- 3-4: 残存艦の状況表示

---

## 4. 型定義

### 4.1 ゲームフェーズの型（GamePhase）

```typescript
type GamePhase =
  | 'title'           // タイトル画面
  | 'placement'       // 配置画面
  | 'battle'          // 対戦画面
  | 'result';         // 結果画面
```

### 4.2 プレイヤーの型（PlayerType）

```typescript
type PlayerType = 'player1' | 'player2';
```

### 4.3 艦の種類の型（ShipType）

```typescript
type ShipType =
  | 'carrier'      // 空母: 5マス
  | 'battleship'   // 戦艦: 4マス
  | 'cruiser'      // 巡洋艦: 3マス
  | 'submarine'    // 潜水艦: 3マス
  | 'destroyer';   // 駆逐艦: 2マス
```

### 4.4 艦のサイズ定義

```typescript
const SHIP_SIZES: Record<ShipType, number> = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2,
};
```

### 4.5 艦の日本語名定義

```typescript
const SHIP_NAMES: Record<ShipType, string> = {
  carrier: '空母',
  battleship: '戦艦',
  cruiser: '巡洋艦',
  submarine: '潜水艦',
  destroyer: '駆逐艦',
};
```

### 4.6 座標の型（Coordinate）

```typescript
type Row = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
type Col = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface Coordinate {
  row: Row;
  col: Col;
}
```

### 4.7 艦の向きの型（Orientation）

```typescript
type Orientation = 'horizontal' | 'vertical';
```

### 4.8 配置された艦の型（PlacedShip）

```typescript
interface PlacedShip {
  type: ShipType;
  coordinates: Coordinate[];  // 艦が占めるマスの座標リスト
  hits: Coordinate[];         // 命中した座標リスト
}
```

### 4.9 マスの状態の型（CellState）

```typescript
type CellState =
  | 'empty'        // 空のマス
  | 'ship'         // 艦があるマス（自陣表示用）
  | 'hit'          // 命中したマス
  | 'miss'         // ミスしたマス
  | 'sunk';        // 撃沈した艦のマス
```

### 4.10 攻撃記録の型（AttackRecord）

```typescript
interface AttackRecord {
  coordinate: Coordinate;
  result: 'hit' | 'miss';
  sunkShip: ShipType | null;  // 撃沈した場合は艦種、そうでなければnull
}
```

### 4.11 攻撃結果の型（AttackResult）

```typescript
interface AttackResult {
  coordinate: Coordinate;
  isHit: boolean;
  isSunk: boolean;
  sunkShipType: ShipType | null;
}
```

### 4.12 プレイヤーの状態の型（PlayerState）

```typescript
interface PlayerState {
  ships: PlacedShip[];
  attackRecords: AttackRecord[];
}
```

### 4.13 ゲーム状態の型（GameState）

```typescript
interface GameState {
  phase: GamePhase;
  currentPlayer: PlayerType;        // 配置中/攻撃中のプレイヤー
  player1: PlayerState;
  player2: PlayerState;
  winner: PlayerType | null;
}
```

### 4.14 初期状態

```typescript
const INITIAL_PLAYER_STATE: PlayerState = {
  ships: [],
  attackRecords: [],
};

const INITIAL_GAME_STATE: GameState = {
  phase: 'title',
  currentPlayer: 'player1',
  player1: INITIAL_PLAYER_STATE,
  player2: INITIAL_PLAYER_STATE,
  winner: null,
};
```

---

## 5. 状態管理設計

### 5.1 ゲーム全体の状態構造

```typescript
// Appコンポーネント内での状態管理
const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
```

### 5.2 状態更新のフロー

#### タイトル画面 → 配置画面

```typescript
const handleStartGame = () => {
  setGameState({
    ...INITIAL_GAME_STATE,
    phase: 'placement',
    currentPlayer: 'player1',
  });
};
```

#### Player 1 配置確定 → Player 2 配置画面

```typescript
const handlePlayer1PlacementConfirm = (ships: PlacedShip[]) => {
  setGameState(prev => ({
    ...prev,
    player1: { ...prev.player1, ships },
    currentPlayer: 'player2',
  }));
};
```

#### Player 2 配置確定 → 対戦画面

```typescript
const handlePlayer2PlacementConfirm = (ships: PlacedShip[]) => {
  const firstPlayer = determineFirstPlayer(); // 先攻プレイヤー決定
  setGameState(prev => ({
    ...prev,
    phase: 'battle',
    player2: { ...prev.player2, ships },
    currentPlayer: firstPlayer,
  }));
};
```

#### 攻撃実行

```typescript
const handleAttack = (coordinate: Coordinate, result: AttackResult) => {
  setGameState(prev => {
    const attackingPlayer = prev.currentPlayer;
    const defendingPlayer = attackingPlayer === 'player1' ? 'player2' : 'player1';

    // 攻撃記録を追加
    const newAttackRecord: AttackRecord = {
      coordinate,
      result: result.isHit ? 'hit' : 'miss',
      sunkShip: result.sunkShipType,
    };

    // 被攻撃側の艦のhits更新
    // ...（艦の命中状態更新ロジック）

    return {
      ...prev,
      [attackingPlayer]: {
        ...prev[attackingPlayer],
        attackRecords: [...prev[attackingPlayer].attackRecords, newAttackRecord],
      },
      // 被攻撃側の艦の状態も更新
    };
  });
};
```

#### ターン交代

```typescript
const handleTurnChange = () => {
  setGameState(prev => ({
    ...prev,
    currentPlayer: prev.currentPlayer === 'player1' ? 'player2' : 'player1',
  }));
};
```

#### 勝者決定 → 結果画面

```typescript
const handleGameEnd = (winner: PlayerType) => {
  setGameState(prev => ({
    ...prev,
    phase: 'result',
    winner,
  }));
};
```

#### 結果画面 → タイトル画面

```typescript
const handleReturnToTitle = () => {
  setGameState(INITIAL_GAME_STATE);
};
```

### 5.3 画面間での状態共有方法

- Appコンポーネントで全ての状態を管理し、各画面コンポーネントにpropsとして渡す
- 状態更新関数（handleXxx）もpropsとして渡す
- Context APIは使用しない（コンポーネント階層が浅いため不要）

---

## 6. ディレクトリ構造

```
src/
├── components/              # UIコンポーネント
│   ├── App.tsx              # ルートコンポーネント
│   ├── TitleScreen.tsx      # タイトル画面
│   ├── PlacementScreen.tsx  # 配置画面
│   ├── BattleScreen.tsx     # 対戦画面
│   ├── ResultScreen.tsx     # 結果画面
│   ├── Grid.tsx             # グリッド表示
│   ├── Cell.tsx             # マス
│   └── Ship.tsx             # 艦表示
├── types/                   # 型定義
│   └── index.ts             # 全ての型定義
├── constants/               # 定数
│   └── index.ts             # SHIP_SIZES, SHIP_NAMES等
├── utils/                   # ユーティリティ関数
│   ├── placement.ts         # 配置関連のロジック
│   ├── battle.ts            # 対戦関連のロジック
│   └── coordinate.ts        # 座標関連のヘルパー
├── main.tsx                 # エントリーポイント
└── index.css                # グローバルスタイル
```

### ファイル命名規約

| 種類 | 命名規則 | 例 |
|------|----------|-----|
| コンポーネント | PascalCase | `Grid.tsx`, `BattleScreen.tsx` |
| ユーティリティ | camelCase | `placement.ts`, `battle.ts` |
| 型定義 | camelCase | `index.ts` |
| 定数 | camelCase | `index.ts` |

---

## 7. ユーティリティ関数設計

### 7.1 placement.ts（配置関連）

```typescript
// 艦を配置できるか検証する
function canPlaceShip(
  coordinate: Coordinate,
  shipType: ShipType,
  orientation: Orientation,
  placedShips: PlacedShip[]
): boolean;

// 艦の占める座標リストを計算する
function calculateShipCoordinates(
  startCoordinate: Coordinate,
  shipType: ShipType,
  orientation: Orientation
): Coordinate[] | null;

// 全ての艦が配置済みか確認する
function areAllShipsPlaced(placedShips: PlacedShip[]): boolean;
```

### 7.2 battle.ts（対戦関連）

```typescript
// 攻撃が命中したか判定する
function checkHit(
  coordinate: Coordinate,
  targetShips: PlacedShip[]
): { isHit: boolean; shipType: ShipType | null };

// 艦が撃沈したか判定する
function checkSunk(ship: PlacedShip): boolean;

// 全艦撃沈か（勝利条件）判定する
function checkAllSunk(ships: PlacedShip[]): boolean;

// 先攻プレイヤーを決定する
function determineFirstPlayer(): PlayerType;
```

### 7.3 coordinate.ts（座標関連）

```typescript
// 座標が有効か検証する
function isValidCoordinate(coordinate: Coordinate): boolean;

// 座標を文字列に変換する（例: {row: 'A', col: 1} → 'A1'）
function coordinateToString(coordinate: Coordinate): string;

// 文字列を座標に変換する（例: 'A1' → {row: 'A', col: 1}）
function stringToCoordinate(str: string): Coordinate | null;

// 2つの座標が同じか比較する
function isSameCoordinate(a: Coordinate, b: Coordinate): boolean;
```

---

## 8. 要件トレーサビリティマトリクス

| 要件番号 | 要件概要 | 対応コンポーネント |
|----------|----------|-------------------|
| 1-1 | ゲームタイトル表示 | TitleScreen |
| 1-2 | ゲーム開始ボタン表示 | TitleScreen |
| 1-3 | 配置画面への遷移 | TitleScreen, App |
| 2-1 | 10×10グリッド表示 | PlacementScreen, Grid |
| 2-2 | 艦の一覧表示 | PlacementScreen, Ship |
| 2-3 | 現在のプレイヤー表示 | PlacementScreen |
| 2-4 | 艦の向き切り替え機能 | PlacementScreen |
| 2-5 | 配置確定ボタン表示 | PlacementScreen |
| 2-6 | グリッドクリックで艦配置 | PlacementScreen, Grid, Cell |
| 2-7 | 艦の向き切り替え操作 | PlacementScreen |
| 2-8 | 境界線超え配置の禁止 | PlacementScreen |
| 2-9 | 艦の重複配置の禁止 | PlacementScreen |
| 2-10 | 全艦配置で確定ボタン有効化 | PlacementScreen |
| 2-11 | 艦未配置で確定ボタン無効化 | PlacementScreen |
| 2-12 | Player 1配置確定で遷移 | PlacementScreen, App |
| 2-13 | Player 2配置確定で対戦画面へ | PlacementScreen, App |
| 3-1 | 攻撃記録グリッド表示 | BattleScreen, Grid |
| 3-2 | 自陣グリッド表示 | BattleScreen, Grid |
| 3-3 | 現在のターン表示 | BattleScreen |
| 3-4 | 残存艦の状況表示 | BattleScreen, Ship |
| 3-5 | 未攻撃マスクリックで攻撃 | BattleScreen, Grid, Cell |
| 3-6 | ミス表示 | BattleScreen, Cell |
| 3-7 | 命中表示 | BattleScreen, Cell |
| 3-8 | 攻撃結果メッセージ表示 | BattleScreen |
| 3-9 | 撃沈メッセージ表示 | BattleScreen |
| 3-10 | 攻撃済みマス再攻撃禁止 | BattleScreen |
| 3-11 | ターン交代 | BattleScreen, App |
| 3-12 | ターン交代時の画面切り替え | BattleScreen |
| 4-1 | 撃沈判定 | BattleScreen |
| 4-2 | 勝者判定 | BattleScreen |
| 4-3 | 結果画面への遷移 | BattleScreen, App |
| 5-1 | 勝者表示 | ResultScreen |
| 5-2 | タイトルに戻るボタン表示 | ResultScreen |
| 5-3 | タイトル画面への遷移 | ResultScreen, App |
| 6-1 | 4画面構成 | App |
| 6-2 | タイトル→配置画面遷移 | App |
| 6-3 | Player 1配置→Player 2配置遷移 | App |
| 6-4 | Player 2配置→対戦画面遷移 | App |
| 6-5 | 勝者決定→結果画面遷移 | App |
| 6-6 | 結果→タイトル画面遷移 | App |
