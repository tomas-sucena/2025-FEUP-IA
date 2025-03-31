import { GameState } from '../game/state';

// components
import Tile from './Tile';

// styling
import './Board.css';

interface BoardProps {
  /** the number of rows/columns of the board */
  size: number;
  /** the current game state */
  state: GameState;
  /** a function to be called when a tile is clicked */
  onTileClick: (smallBoardIndex: number, tileIndex: number) => void;
}

export default function Board({ size, state, onTileClick }: BoardProps) {
  // set the board size in CSS
  const style = { '--size': size } as React.CSSProperties;

  // render the board tiles
  const tiles = state.smallBoards.map((smallBoard, smallBoardIndex) =>
    smallBoard.map((tile, tileIndex) => (
      <Tile
        key={tileIndex}
        symbol={tile}
        disabled={
          state.nextBoardIndex >= 0 && state.nextBoardIndex !== smallBoardIndex
        }
        onClick={onTileClick.bind(null, smallBoardIndex, tileIndex)}
      />
    )),
  );

  return (
    <div id="board" style={style}>
      {tiles.map((smallBoard) => (
        <div className="small-board" style={style}>
          {smallBoard}
        </div>
      ))}
    </div>
  );
}
