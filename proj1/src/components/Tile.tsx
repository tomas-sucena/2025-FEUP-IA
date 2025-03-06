import './Tile.css';

export default function Tile({ symbol }: { symbol: string }) {
  return <button className="tile">{symbol}</button>;
}
