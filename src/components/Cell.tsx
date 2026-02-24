import type { CellState, Coordinate } from '../types';

interface CellProps {
  state: CellState;
  coordinate: Coordinate;
  onClick: (coordinate: Coordinate) => void;
  disabled?: boolean;
  showShip?: boolean;
}

export function Cell({ state, coordinate, onClick, disabled = false, showShip = true }: CellProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick(coordinate);
    }
  };

  const getCellStyle = (): string => {
    const baseStyle = 'w-8 h-8 border border-gray-400 flex items-center justify-center cursor-pointer';

    if (disabled) {
      return `${baseStyle} cursor-not-allowed`;
    }

    switch (state) {
      case 'ship':
        return showShip
          ? `${baseStyle} bg-gray-600`
          : `${baseStyle} bg-blue-200 hover:bg-blue-300`;
      case 'hit':
        return `${baseStyle} bg-red-500`;
      case 'miss':
        return `${baseStyle} bg-white`;
      case 'sunk':
        return `${baseStyle} bg-red-800`;
      case 'empty':
      default:
        return `${baseStyle} bg-blue-200 hover:bg-blue-300`;
    }
  };

  const getCellContent = (): string => {
    switch (state) {
      case 'hit':
      case 'sunk':
        return '×';
      case 'miss':
        return '○';
      default:
        return '';
    }
  };

  return (
    <div
      className={getCellStyle()}
      onClick={handleClick}
      data-testid={`cell-${coordinate.row}${coordinate.col}`}
    >
      {getCellContent()}
    </div>
  );
}
