import { useEffect, useState } from 'react';
import { GameState } from '../game/state';
import { GameAI } from '../game/AI';

// components
import Board from './Board';

interface GameProps {
  /** the number of rows and columns of the board */
  size: number;
  /** the first player */
  player1?: GameAI;
  /** the second player */
  player2?: GameAI;
}

// a function for the computer players to play
const play = (player: GameAI, state: GameState) => {
  const start = Date.now();

  // compute the move
  const move = player.chooseMove!(state);

  // find the corresponding tile
  const tile = document.getElementsByClassName('small-board')[move.boardIndex]
    .children[move.tileIndex] as HTMLButtonElement;

  // click the tile
  setTimeout(() => tile.click(), Math.max(1000 - Date.now() + start, 0));
};

export default function Game({ size, player1, player2 }: GameProps) {
  // initialize the game state
  const [state, setState] = useState(GameState.fromSize(size));

  // a function for handling tile clicks
  const onTileClick = (boardIndex: number, tileIndex: number) => {
    if (state.makeMove(boardIndex, tileIndex)) {
      setState(GameState.fromState(state));
    }
  };

  // handle computer player turns
  useEffect(() => {
    const player = state.nextPlayer === 'X' ? player1 : player2;
    if (player) {
      play(player, state);
    }
  });

  // render the board
  return <Board size={size} state={state} onTileClick={onTileClick} />;
}
