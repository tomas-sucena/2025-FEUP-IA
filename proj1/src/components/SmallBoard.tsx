import { useState } from 'react';

// algorithms
import { checkWinner } from '../algorithms/ai';

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
  // initialize the board
  const [board, setBoard] = useState(
    initialBoard ?? Array(rows * columns).fill(''),
  );
  const [xIsNext, setXisNext] = useState(true);
  const [winner, setWinner] = useState('');

  // a function for handling tile clicks
  function handleTileClick(index: number) {
    // if the tile already has a marker, do nothing
    if (winner || board[index]) {
      return;
    }

    const marker = xIsNext ? 'X' : 'O';
    const nextBoard = [...board];
    nextBoard[index] = marker;

    setBoard(nextBoard);
    setXisNext(!xIsNext);

    if (checkWinner(nextBoard, rows, columns, marker)) {
      console.log(`Winner: ${marker}`);
      setWinner(marker);
    }
  }

  return (
    <div className="small-board">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="small-board-row">
          {Array.from({ length: columns }).map((_, j) => {
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
