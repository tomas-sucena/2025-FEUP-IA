// assets
import X from '../assets/X.svg';
import O from '../assets/O.svg';

// components
import Tile from './Tile';

// styling
import './SmallBoard.css';

interface SmallBoardProps {
  /** an array representing the tiles of the small board */
  smallBoard: string[];
  /** the symbol of the player who won the board */
  winner: string;
  /** indicates if the tiles on the small board can be clicked */
  disabled: boolean;
  /** a function to be called when a tile is clicked */
  handleTileClick: (tileIndex: number) => void;
}

export default function SmallBoard({
  smallBoard,
  winner,
  disabled,
  handleTileClick,
}: SmallBoardProps) {
  return (
    <div
      className="small-board"
      data-winner={winner || null}
      data-disabled={disabled || null}
    >
      {winner && <img src={winner === 'X' ? X : O} alt={winner} />}
      {smallBoard.map((symbol, tileIndex) => (
        <Tile
          key={`tile-${tileIndex}`}
          symbol={symbol}
          disabled={disabled}
          onClick={handleTileClick.bind(null, tileIndex)}
        />
      ))}
    </div>
  );
}
