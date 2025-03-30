// styling
import './Board.css';

interface BoardProps {
  /** the number of rows/columns of the board */
  size: number;
  /** the board tiles */
  tiles: React.ReactElement[][];
}

export default function Board({ size, tiles: smallBoards }: BoardProps) {
  const style = { '--size': size } as React.CSSProperties;

  return (
    <div id="board" style={style}>
      {smallBoards.map((smallBoard) => (
        <div className="small-board" style={style}>
          {smallBoard}
        </div>
      ))}
    </div>
  );
}
