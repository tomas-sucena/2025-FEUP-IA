// styling
import './Tile.css';

interface TileProps {
  /** the symbol on the tile */
  symbol: string;
  /** a function to be called when a tile is clicked */
  handleTileClick: () => void;
}

export default function Tile({ symbol, handleTileClick }: TileProps) {
  return (
    <button className="tile" onClick={handleTileClick}>
      {symbol}
    </button>
  );
}
