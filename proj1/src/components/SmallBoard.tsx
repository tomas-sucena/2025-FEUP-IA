import { useState } from 'react';

// components
import Tile from './Tile';

// styling
import './SmallBoard.css';

interface SmallBoardProps {
  /** the number of rows of the small board */
  rows: number;
  /** the number of columns of the small board */
  columns: number;
  /** indicates if the player that will play next has the X marker */
  //xIsNext: boolean;
  /** the initial small board configuration, if any */
  initialBoard?: string[];
}

export default function SmallBoard({
  rows,
  columns,
  initialBoard,
}: SmallBoardProps) {
  // a function that repeats an element n times
  const range = (n: number) => {
    return Array(n)
      .fill(0)
      .map((_, index) => index);
  };

  // initialize the board
  const [board, setBoard] = useState(
    initialBoard ?? Array(rows * columns).fill(''),
  );
  const [xIsNext, setXisNext] = useState(true);

  // a function for handling tile clicks
  function handleTileClick(index: number) {
    // if the tile already has a marker, do nothing
    if (board[index]) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = xIsNext ? 'X' : 'O';

    setBoard(nextBoard);
    setXisNext(!xIsNext);
  }

  return (
    <div className="small-board">
      {range(rows).map((i) => (
        <div className="small-board-row">
          {range(columns).map((j) => {
            const index = i * rows + j; // the index of the tile
            return (
              <Tile
                symbol={board[index]}
                handleClick={handleTileClick.bind(null, index)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
