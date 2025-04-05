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
  const player = state.nextPlayer === 'X' ? player1 : player2;
  const ongoing = state.validMoves.length > 0; // indicates if the game is still ongoing

  // a function for handling tile clicks
  const onTileClick = (smallBoardIndex: number, tileIndex: number) => {
    if (state.makeMove(smallBoardIndex, tileIndex)) {
      setState(GameState.fromState(state));
    }
  };

  // handle computer player turns
  useEffect(() => {
    if (player && ongoing) {
      setTimeout(() => play(player, state), 0);
    }
  });

  // render the board
  return (
    <>
      <Board {...state} onTileClick={onTileClick} />
      <aside>
        {ongoing
          ? `It's your turn, ${state.nextPlayer}!`
          : state.winner
            ? `${state.winner} has won!`
            : `It's a tie!`}
      </aside>
    </>
  );
}
