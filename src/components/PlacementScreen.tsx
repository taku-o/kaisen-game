import { useState, useCallback } from 'react';
import type { PlayerType, ShipType, Orientation, PlacedShip, Coordinate, CellState } from '../types';
import { SHIP_TYPES, GRID_ROWS, GRID_COLS } from '../constants';
import { Grid } from './Grid';
import { Ship } from './Ship';
import { canPlaceShip, calculateShipCoordinates, areAllShipsPlaced } from '../utils/placement';

interface PlacementScreenProps {
  currentPlayer: PlayerType;
  onPlacementConfirm: (ships: PlacedShip[]) => void;
}

export function PlacementScreen({ currentPlayer, onPlacementConfirm }: PlacementScreenProps) {
  const [placedShips, setPlacedShips] = useState<PlacedShip[]>([]);
  const [selectedShipType, setSelectedShipType] = useState<ShipType | null>(null);
  const [orientation, setOrientation] = useState<Orientation>('horizontal');

  const playerName = currentPlayer === 'player1' ? 'Player 1' : 'Player 2';
  const allShipsPlaced = areAllShipsPlaced(placedShips);

  // グリッドのセル状態を計算
  const getCells = useCallback((): CellState[][] => {
    const cells: CellState[][] = GRID_ROWS.map(() =>
      GRID_COLS.map(() => 'empty' as CellState)
    );

    for (const ship of placedShips) {
      for (const coord of ship.coordinates) {
        const rowIndex = GRID_ROWS.indexOf(coord.row);
        const colIndex = coord.col - 1;
        cells[rowIndex][colIndex] = 'ship';
      }
    }

    return cells;
  }, [placedShips]);

  // 艦が配置済みかチェック
  const isShipPlaced = (shipType: ShipType): boolean => {
    return placedShips.some((ship) => ship.type === shipType);
  };

  // グリッドクリック時の処理
  const handleCellClick = (coordinate: Coordinate) => {
    if (!selectedShipType) {
      return;
    }

    if (isShipPlaced(selectedShipType)) {
      return;
    }

    if (!canPlaceShip(coordinate, selectedShipType, orientation, placedShips)) {
      return;
    }

    const coordinates = calculateShipCoordinates(coordinate, selectedShipType, orientation);
    if (!coordinates) {
      return;
    }

    const newShip: PlacedShip = {
      type: selectedShipType,
      coordinates,
      hits: [],
    };

    setPlacedShips([...placedShips, newShip]);
    setSelectedShipType(null);
  };

  // 艦選択時の処理
  const handleShipSelect = (shipType: ShipType) => {
    if (!isShipPlaced(shipType)) {
      setSelectedShipType(shipType);
    }
  };

  // 向き切り替え
  const toggleOrientation = () => {
    setOrientation(orientation === 'horizontal' ? 'vertical' : 'horizontal');
  };

  // 配置確定
  const handleConfirm = () => {
    if (allShipsPlaced) {
      onPlacementConfirm(placedShips);
    }
  };

  // リセット
  const handleReset = () => {
    setPlacedShips([]);
    setSelectedShipType(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">艦配置</h1>
        <h2 className="text-xl mb-8 text-center text-blue-600" data-testid="current-player">
          {playerName} の番
        </h2>

        <div className="flex gap-8 justify-center">
          {/* グリッド */}
          <div>
            <Grid
              cells={getCells()}
              onCellClick={handleCellClick}
              disabled={!selectedShipType}
              showShips={true}
            />
          </div>

          {/* 艦リスト */}
          <div className="w-64">
            <h3 className="text-lg font-bold mb-4">配置する艦</h3>
            {SHIP_TYPES.map((shipType) => (
              <Ship
                key={shipType}
                shipType={shipType}
                isPlaced={isShipPlaced(shipType)}
                isSunk={false}
                isSelected={selectedShipType === shipType}
                onClick={() => handleShipSelect(shipType)}
              />
            ))}

            <div className="mt-6">
              <button
                onClick={toggleOrientation}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded mb-2"
                data-testid="orientation-button"
              >
                向き: {orientation === 'horizontal' ? '横' : '縦'}
              </button>

              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded mb-2"
              >
                リセット
              </button>

              <button
                onClick={handleConfirm}
                disabled={!allShipsPlaced}
                className={`w-full px-4 py-2 rounded font-bold ${
                  allShipsPlaced
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                data-testid="confirm-button"
              >
                配置確定
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
