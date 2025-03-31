// styling
import './Tile.css';

interface TileProps {
  /** the symbol on the tile */
  symbol: string;
  /** indicates if the tile cannot be clicked */
  disabled: boolean;
  /** a function to be called when a tile is clicked */
  onClick: () => void;
}

export default function Tile({ symbol, disabled, onClick }: TileProps) {
  return (
    <button
      className="tile"
      onClick={onClick}
      data-symbol={symbol || null}
      data-disabled={disabled || null}
    >
      {symbol}
    </button>
  );
}
