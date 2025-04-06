import { useEffect, useState } from 'react';
import { GameState } from '../game/state';
import { GamePlayer } from '../game/player';

// components
import Board from '../components/Board';
import { saveGame } from './GameLoader';

interface GameProps {
  /** the initial game state */
  initialState: GameState;
  /** the first player */
  playerX: GamePlayer;
  /** the second player */
  playerO: GamePlayer;
}

// a function for the computer players to play
const play = (player: GamePlayer, state: GameState) => {
  const start = Date.now();

  // compute the move
  const [boardIndex, tileIndex] = player.chooseMove!(state);

  // find the corresponding tile
  const tile = document.getElementsByClassName('small-board')[boardIndex]
    .children[tileIndex] as HTMLButtonElement;

  // click the tile
  setTimeout(() => tile.click(), Math.max(1000 - Date.now() + start, 0));
};

export default function Game({ initialState, playerX, playerO }: GameProps) {
  // initialize the game state
  const [state, setState] = useState(initialState);
  const player = state.nextPlayer === 'X' ? playerX : playerO;
  const ongoing = state.validMoves.length > 0; // indicates if the game is still ongoing

  // a function for handling tile clicks
  const handleTileClick = (smallBoardIndex: number, tileIndex: number) => {
    if (state.makeMove(smallBoardIndex, tileIndex)) {
      setState(GameState.clone(state));
    }
  };

  useEffect(() => {
    // handle computer player turns
    if (player.isAI() && ongoing) {
      setTimeout(() => play(player, state), 2);
    }

    // save the game
    saveGame(state, playerX, playerO);
  });

  // render the board
  return (
    <>
      <Board {...state} handleTileClick={handleTileClick} />
      <p>
        {ongoing
          ? `It's your turn, ${player.name}!`
          : state.winner
            ? `${player.name} has won!`
            : `It's a tie!`}
      </p>
    </>
  );
}
