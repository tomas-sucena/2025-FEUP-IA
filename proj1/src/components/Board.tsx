import { Children } from 'react';

// styling
import './Board.css';

export default function Board({ children }: React.PropsWithChildren) {
  const smallBoards = children as React.ReactElement[];

  return (
    <div id="big-board" className="board">
      {smallBoards.map((smallBoard) => (
        <div className="board">{smallBoard}</div>
      ))}
    </div>
  );
}
