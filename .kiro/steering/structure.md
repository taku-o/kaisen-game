# Structure Steering

## プロジェクト構造

```
kaisen-game/
├── .kiro/
│   ├── steering/     # プロジェクト全体のガイドライン
│   └── specs/        # 機能仕様書
├── src/              # ソースコード（実装時に作成）
├── CLAUDE.md         # AI開発ガイドライン
└── CLAUDE.local.md   # ローカル開発ルール
```

## ディレクトリ設計パターン

### 機能ベース構造

```
src/
├── components/       # UIコンポーネント
│   ├── Grid/         # グリッド表示
│   ├── Ship/         # 艦表示
│   └── ...
├── features/         # 機能モジュール
│   ├── placement/    # 艦配置機能
│   ├── battle/       # 対戦機能
│   └── ...
├── hooks/            # カスタムフック
├── types/            # 型定義
└── utils/            # ユーティリティ
```

## 画面構成

4画面構成で遷移を管理:

1. タイトル画面 → 2. 配置画面 → 3. 対戦画面 → 4. 結果画面

## 命名規約

### ファイル名

- コンポーネント: PascalCase（例: `Grid.tsx`, `ShipPlacer.tsx`）
- ユーティリティ: camelCase（例: `gameUtils.ts`）
- 型定義: camelCase（例: `types.ts`）

### 変数・関数名

- 変数: camelCase
- 関数: camelCase
- 型/インターフェース: PascalCase
- 定数: UPPER_SNAKE_CASE

## ゲームデータ構造

### グリッド

- 10×10マス（A-J × 1-10）
- 座標は`{row: 'A'-'J', col: 1-10}`形式

### 艦

| 艦種 | マス数 | 識別子 |
|------|--------|--------|
| 空母 | 5 | carrier |
| 戦艦 | 4 | battleship |
| 巡洋艦 | 3 | cruiser |
| 潜水艦 | 3 | submarine |
| 駆逐艦 | 2 | destroyer |
