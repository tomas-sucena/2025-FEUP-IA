import { useState } from 'react';
import { GameState } from '../game/state';

// components
import Board from './Board';
import Tile from './Tile';

export default function Game({ size }: { size: number }) {
  // initialize the game state
  const [state, setState] = useState(GameState.fromSize(size));

  // a function for handling tile clicks
  const onTileClick = (boardIndex: number, tileIndex: number) => {
    if (state.makeMove(boardIndex, tileIndex)) {
      setState(GameState.fromState(state));
    }
  };

  // render the board
  return <Board size={size} state={state} onTileClick={onTileClick} />;
}
