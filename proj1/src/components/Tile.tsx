import './Tile.css';

interface TileProps {
  /** the symbol that is marked on the tile */
  symbol: string;
  /** */
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Tile({ symbol, handleClick }: TileProps) {
  return (
    <button className="tile" onClick={handleClick}>
      {symbol}
    </button>
  );
}
