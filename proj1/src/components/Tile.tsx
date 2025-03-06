import './Tile.css';

export default function Tile({ symbol }: { symbol: string }) {
  return <div className="tile">{symbol}</div>;
}
