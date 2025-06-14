// components
import SmallBoard from './SmallBoard';

// styling
import './Board.css';

interface BoardProps {
  /** the number of rows/columns of the board */
  size: number;
  /** an array that represents the big board */
  board: string[];
  /** a 2D array that represents the small boards */
  smallBoards: string[][];
  /** the index of the small board the next player has to play in */
  nextSmallBoardIndex: number;
  /** a function to be called when a tile is clicked */
  handleTileClick: (smallBoardIndex: number, tileIndex: number) => void;
}

export default function Board({
  size,
  board,
  smallBoards,
  nextSmallBoardIndex,
  handleTileClick,
}: BoardProps) {
  // set the board size in CSS
  const style = { '--size': size } as React.CSSProperties;

  return (
    <div id="board" style={style}>
      {smallBoards.map((smallBoard, smallBoardIndex) => (
        <SmallBoard
          key={`small-board-${smallBoardIndex}`}
          smallBoard={smallBoard}
          winner={board[smallBoardIndex]}
          disabled={
            board[smallBoardIndex] !== '' ||
            (nextSmallBoardIndex >= 0 &&
              nextSmallBoardIndex !== smallBoardIndex)
          }
          handleTileClick={handleTileClick.bind(null, smallBoardIndex)}
        />
      ))}
    </div>
  );
}
