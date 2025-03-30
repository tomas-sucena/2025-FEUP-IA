// styling
import './Tile.css';

interface TileProps {
  /** the symbol on the tile */
  symbol: string;
  /** indicates if the tile should appear highlighted */
  highlight: boolean;
  /** a function to be called when a tile is clicked */
  onClick: () => void;
}

export default function Tile({ symbol, highlight, onClick }: TileProps) {
  return (
    <button
      className="tile"
      onClick={onClick}
      data-symbol={symbol || null}
      data-highlight={highlight || null}
    >
      {symbol}
    </button>
  );
}
