import type { CellState, Coordinate } from '../types';
import { GRID_ROWS, GRID_COLS } from '../constants';
import { Cell } from './Cell';

interface GridProps {
  cells: CellState[][];
  onCellClick: (coordinate: Coordinate) => void;
  disabled?: boolean;
  showShips?: boolean;
}

export function Grid({ cells, onCellClick, disabled = false, showShips = true }: GridProps) {
  return (
    <div className="inline-block">
      {/* 列ラベル行 */}
      <div className="flex">
        <div className="w-8 h-8" /> {/* 左上コーナー */}
        {GRID_COLS.map((col) => (
          <div
            key={col}
            className="w-8 h-8 flex items-center justify-center font-bold"
          >
            {col}
          </div>
        ))}
      </div>

      {/* グリッド本体 */}
      {GRID_ROWS.map((row, rowIndex) => (
        <div key={row} className="flex">
          {/* 行ラベル */}
          <div className="w-8 h-8 flex items-center justify-center font-bold">
            {row}
          </div>
          {/* セル */}
          {GRID_COLS.map((col, colIndex) => (
            <Cell
              key={`${row}${col}`}
              state={cells[rowIndex][colIndex]}
              coordinate={{ row, col }}
              onClick={onCellClick}
              disabled={disabled}
              showShip={showShips}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
