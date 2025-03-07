// components
import SmallBoard from './SmallBoard';

// styling
import './Board.css';

interface BoardProps {
  /** the number of rows of the small board */
  rows: number;
  /** the number of columns of the small board */
  columns: number;
}

export default function Board({ rows, columns }: BoardProps) {
  // a function that repeats an element n times
  const range = (n: number) => {
    return Array(n)
      .fill(0)
      .map((_, index) => index);
  };

  return (
    <div className="board">
      {range(rows).map((i) => (
        <div className="board-row">
          {range(columns).map((j) => (
            <SmallBoard rows={rows} columns={columns} />
          ))}
        </div>
      ))}
    </div>
  );
}
