import { useState } from 'react';
import GameState from '../algorithms/state';

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
  const [state, setState] = useState(initialState ?? new GameState({ size }));

  // a function to be called when a tile is clicked
  const handleTileClick = (smallBoardIndex: number, tileIndex: number) => {
    const smallBoard = state.tiles[smallBoardIndex];

    // if the tile already has a symbol, do nothing
    if (state.boards[smallBoardIndex] || smallBoard[tileIndex]) {
      return;
    }

    state.makeMove(smallBoardIndex, tileIndex);
    setState(new GameState(state));
  };

  return (
    <div className="board">
      {Array.from({ length: size }).map((_, i) => (
        <div className="board-row">
          {Array.from({ length: size }).map((_, j) => {
            const index = i * size + j; // the index of the small board
            return (
              <SmallBoard
                size={size}
                tiles={state.tiles[index]}
                handleTileClick={handleTileClick.bind(null, index)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
