import { useState } from 'react';
import { GameState } from '../game/state';

// components
import SmallBoard from './SmallBoard';

// styling
import './Board.css';

interface BoardProps {
  /** the number of rows/columns of the board */
  size: number;
  /** the initial game state */
  initialState?: GameState;
}

export default function Board({ size, initialState }: BoardProps) {
  // initialize the game state
  const [state, setState] = useState(initialState ?? GameState.fromSize(size));

  // a function to be called when a tile is clicked
  const handleTileClick = (boardIndex: number, tileIndex: number) => {
    if (state.makeMove([boardIndex, tileIndex])) {
      setState(GameState.fromState(state));
    }
  };

  return (
    <div id="board">
      {Array.from({ length: size }).map((_, i) => (
        <div className="board-row" key={i}>
          {Array.from({ length: size }).map((_, j) => {
            const index = i * size + j; // the index of the small board
            return (
              <SmallBoard
                size={size}
                tiles={state.tiles[index]}
                highlight={state.nextBoardIndex === index}
                handleTileClick={handleTileClick.bind(null, index)}
                key={j}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
