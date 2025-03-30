// styling
import './Tile.css';

interface TileProps {
  /** the symbol on the tile */
  symbol: string;
  /** a function to be called when a tile is clicked */
  onClick: () => void;
}

export default function Tile({ symbol, onClick }: TileProps) {
  return (
    <button className="tile" onClick={onClick} data-symbol={symbol || null}>
      {symbol}
    </button>
  );
}
