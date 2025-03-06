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
  const repeat = (n: number, node: React.ReactElement) => {
    return Array(n).fill(node);
  };

  return (
    <div className="small-board">
      {repeat(
        rows,
        <div className="small-board-row">
          {repeat(columns, <Tile symbol="X" />)}
        </div>,
      )}
    </div>
  );
}
