// components
import Tile from './Tile';

// styling
import './SmallBoard.css';

interface SmallBoardProps {
  /** the number of rows of the small board */
  rows: number;
  /** the number of columns of the small board */
  columns: number;
}

export default function SmallBoard({ rows, columns }: SmallBoardProps) {
  // a function that repeats an element n times
  const range = (n: number) => {
    return Array(n)
      .fill(0)
      .map((_, index) => index);
  };

  // initialize the board
  const board: string[] = Array(rows * columns).fill('');

  return (
    <div className="small-board">
      {range(rows).map((i) => (
        <div className="small-board-row">
          {range(columns).map((j) => (
            <Tile symbol={board[i * rows + j]} />
          ))}
        </div>
      ))}
    </div>
  );
}
