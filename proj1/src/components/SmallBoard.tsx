// components
import Tile from './Tile';

// styling
import './SmallBoard.css';

interface SmallBoardProps {
  /** the number of rows/columns of the small board */
  size: number;
  /** an array representing the tiles of the small board */
  tiles: string[];
  /** a function to be called when a tile is clicked */
  handleTileClick: (tileIndex: number) => void;
}

export default function SmallBoard({
  size,
  tiles,
  handleTileClick,
}: SmallBoardProps) {
  return (
    <div className="small-board">
      {Array.from({ length: size }).map((_, i) => (
        <div className="small-board-row">
          {Array.from({ length: size }).map((_, j) => {
            const index = i * size + j; // the index of the tile
            return (
              <Tile
                symbol={tiles[index]}
                handleTileClick={handleTileClick.bind(null, index)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
