import type { ShipType } from '../types';
import { SHIP_NAMES, SHIP_SIZES } from '../constants';

interface ShipProps {
  shipType: ShipType;
  isPlaced: boolean;
  isSunk: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export function Ship({ shipType, isPlaced, isSunk, isSelected = false, onClick }: ShipProps) {
  const name = SHIP_NAMES[shipType];
  const size = SHIP_SIZES[shipType];

  const getShipStyle = (): string => {
    const baseStyle = 'p-2 rounded border-2 mb-2';

    if (isSunk) {
      return `${baseStyle} bg-red-200 border-red-500 line-through`;
    }

    if (isPlaced) {
      return `${baseStyle} bg-gray-200 border-gray-400`;
    }

    if (isSelected) {
      return `${baseStyle} bg-blue-200 border-blue-500 cursor-pointer`;
    }

    return `${baseStyle} bg-white border-gray-300 cursor-pointer hover:bg-blue-100`;
  };

  return (
    <div
      className={getShipStyle()}
      onClick={!isPlaced && !isSunk && onClick ? onClick : undefined}
      data-testid={`ship-${shipType}`}
    >
      <span className="font-bold">{name}</span>
      <span className="ml-2 text-gray-600">({size}マス)</span>
      {isPlaced && !isSunk && <span className="ml-2 text-green-600">配置済</span>}
      {isSunk && <span className="ml-2 text-red-600">撃沈</span>}
    </div>
  );
}
