import { useState, useCallback } from 'react';
import type { PlayerType, PlacedShip, Coordinate, CellState, AttackResult } from '../types';
import { GRID_ROWS, GRID_COLS, SHIP_TYPES } from '../constants';
import { Grid } from './Grid';
import { Ship } from './Ship';
import { checkHit, checkSunk, checkAllSunk, recordHit } from '../utils/battle';
import { isSameCoordinate } from '../utils/coordinate';

interface BattleScreenProps {
  player1Ships: PlacedShip[];
  player2Ships: PlacedShip[];
  initialTurn: PlayerType;
  onGameEnd: (winner: PlayerType) => void;
}

export function BattleScreen({
  player1Ships: initialPlayer1Ships,
  player2Ships: initialPlayer2Ships,
  initialTurn,
  onGameEnd,
}: BattleScreenProps) {
  const [currentTurn, setCurrentTurn] = useState<PlayerType>(initialTurn);
  const [player1Ships, setPlayer1Ships] = useState<PlacedShip[]>(initialPlayer1Ships);
  const [player2Ships, setPlayer2Ships] = useState<PlacedShip[]>(initialPlayer2Ships);
  const [player1Attacks, setPlayer1Attacks] = useState<Coordinate[]>([]);
  const [player2Attacks, setPlayer2Attacks] = useState<Coordinate[]>([]);
  const [lastAttackResult, setLastAttackResult] = useState<AttackResult | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentPlayerName = currentTurn === 'player1' ? 'Player 1' : 'Player 2';
  const opponentShips = currentTurn === 'player1' ? player2Ships : player1Ships;
  const myShips = currentTurn === 'player1' ? player1Ships : player2Ships;
  const myAttacks = currentTurn === 'player1' ? player1Attacks : player2Attacks;

  // 攻撃記録グリッドのセル状態を計算
  const getAttackGridCells = useCallback((): CellState[][] => {
    const cells: CellState[][] = GRID_ROWS.map(() =>
      GRID_COLS.map(() => 'empty' as CellState)
    );

    const attacks = currentTurn === 'player1' ? player1Attacks : player2Attacks;
    const targetShips = currentTurn === 'player1' ? player2Ships : player1Ships;

    for (const attack of attacks) {
      const rowIndex = GRID_ROWS.indexOf(attack.row);
      const colIndex = attack.col - 1;

      const { isHit } = checkHit(attack, targetShips);
      if (isHit) {
        // 撃沈判定
        const hitShip = targetShips.find((ship) =>
          ship.coordinates.some((coord) => isSameCoordinate(coord, attack))
        );
        if (hitShip && checkSunk(hitShip)) {
          // 撃沈した艦の全マスをsunkにする
          for (const coord of hitShip.coordinates) {
            const sunkRowIndex = GRID_ROWS.indexOf(coord.row);
            const sunkColIndex = coord.col - 1;
            cells[sunkRowIndex][sunkColIndex] = 'sunk';
          }
        } else {
          cells[rowIndex][colIndex] = 'hit';
        }
      } else {
        cells[rowIndex][colIndex] = 'miss';
      }
    }

    return cells;
  }, [currentTurn, player1Attacks, player2Attacks, player1Ships, player2Ships]);

  // 自陣グリッドのセル状態を計算
  const getMyGridCells = useCallback((): CellState[][] => {
    const cells: CellState[][] = GRID_ROWS.map(() =>
      GRID_COLS.map(() => 'empty' as CellState)
    );

    const ships = currentTurn === 'player1' ? player1Ships : player2Ships;
    const enemyAttacks = currentTurn === 'player1' ? player2Attacks : player1Attacks;

    // 艦を配置
    for (const ship of ships) {
      const isSunk = checkSunk(ship);
      for (const coord of ship.coordinates) {
        const rowIndex = GRID_ROWS.indexOf(coord.row);
        const colIndex = coord.col - 1;

        const isHit = ship.hits.some((hit) => isSameCoordinate(hit, coord));
        if (isSunk) {
          cells[rowIndex][colIndex] = 'sunk';
        } else if (isHit) {
          cells[rowIndex][colIndex] = 'hit';
        } else {
          cells[rowIndex][colIndex] = 'ship';
        }
      }
    }

    // 敵の攻撃でミスしたマスを表示
    for (const attack of enemyAttacks) {
      const rowIndex = GRID_ROWS.indexOf(attack.row);
      const colIndex = attack.col - 1;
      if (cells[rowIndex][colIndex] === 'empty') {
        cells[rowIndex][colIndex] = 'miss';
      }
    }

    return cells;
  }, [currentTurn, player1Ships, player2Ships, player1Attacks, player2Attacks]);

  // 攻撃済みかチェック
  const isAlreadyAttacked = (coordinate: Coordinate): boolean => {
    return myAttacks.some((attack) => isSameCoordinate(attack, coordinate));
  };

  // 攻撃処理
  const handleAttack = (coordinate: Coordinate) => {
    if (isTransitioning) return;
    if (isAlreadyAttacked(coordinate)) return;

    // 攻撃記録を追加
    if (currentTurn === 'player1') {
      setPlayer1Attacks([...player1Attacks, coordinate]);
    } else {
      setPlayer2Attacks([...player2Attacks, coordinate]);
    }

    // 命中判定
    const { isHit, shipType } = checkHit(coordinate, opponentShips);

    if (isHit && shipType) {
      // 艦に命中を記録
      const updatedShips = recordHit(opponentShips, coordinate);
      if (currentTurn === 'player1') {
        setPlayer2Ships(updatedShips);
      } else {
        setPlayer1Ships(updatedShips);
      }

      // 撃沈判定
      const hitShip = updatedShips.find((ship) => ship.type === shipType);
      const isSunk = hitShip ? checkSunk(hitShip) : false;

      setLastAttackResult({
        coordinate,
        isHit: true,
        isSunk,
        sunkShipType: isSunk ? shipType : null,
      });

      // 全艦撃沈判定（勝利判定）
      if (checkAllSunk(updatedShips)) {
        setTimeout(() => {
          onGameEnd(currentTurn);
        }, 1500);
        return;
      }
    } else {
      setLastAttackResult({
        coordinate,
        isHit: false,
        isSunk: false,
        sunkShipType: null,
      });
    }

    // ターン交代
    setTimeout(() => {
      setIsTransitioning(true);
    }, 1500);
  };

  // ターン交代確認後の処理
  const handleContinue = () => {
    setCurrentTurn(currentTurn === 'player1' ? 'player2' : 'player1');
    setLastAttackResult(null);
    setIsTransitioning(false);
  };

  // 艦が撃沈されているか
  const isShipSunk = (ships: PlacedShip[], shipType: string): boolean => {
    const ship = ships.find((s) => s.type === shipType);
    return ship ? checkSunk(ship) : false;
  };

  // ターン交代画面
  if (isTransitioning) {
    const nextPlayer = currentTurn === 'player1' ? 'Player 2' : 'Player 1';
    return (
      <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-8">ターン交代</h1>
        <p className="text-2xl mb-12">{nextPlayer} の番です</p>
        <button
          onClick={handleContinue}
          className="px-8 py-4 text-xl bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
          data-testid="continue-button"
        >
          準備完了
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">対戦</h1>
        <h2 className="text-xl mb-6 text-center text-blue-600" data-testid="current-turn">
          {currentPlayerName} の番
        </h2>

        {/* 攻撃結果メッセージ */}
        {lastAttackResult && (
          <div
            className={`text-center mb-4 p-4 rounded text-xl font-bold ${
              lastAttackResult.isHit ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}
            data-testid="attack-result"
          >
            {lastAttackResult.isSunk
              ? `撃沈！`
              : lastAttackResult.isHit
                ? '命中！'
                : 'ミス...'}
          </div>
        )}

        <div className="flex gap-8 justify-center">
          {/* 攻撃記録グリッド */}
          <div data-testid="attack-grid">
            <h3 className="text-lg font-bold mb-2 text-center">相手の海域</h3>
            <Grid
              cells={getAttackGridCells()}
              onCellClick={handleAttack}
              disabled={isTransitioning}
              showShips={false}
            />
          </div>

          {/* 自陣グリッド */}
          <div data-testid="own-grid">
            <h3 className="text-lg font-bold mb-2 text-center">自分の海域</h3>
            <Grid
              cells={getMyGridCells()}
              onCellClick={() => {}}
              disabled={true}
              showShips={true}
            />
          </div>
        </div>

        {/* 残存艦表示 */}
        <div className="flex gap-8 justify-center mt-8">
          <div className="w-48">
            <h4 className="font-bold mb-2 text-center">相手の艦隊</h4>
            {SHIP_TYPES.map((shipType) => (
              <Ship
                key={`opponent-${shipType}`}
                shipType={shipType}
                isPlaced={true}
                isSunk={isShipSunk(opponentShips, shipType)}
              />
            ))}
          </div>
          <div className="w-48">
            <h4 className="font-bold mb-2 text-center">自分の艦隊</h4>
            {SHIP_TYPES.map((shipType) => (
              <Ship
                key={`my-${shipType}`}
                shipType={shipType}
                isPlaced={true}
                isSunk={isShipSunk(myShips, shipType)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
