import { useEffect, useState } from 'react';
import { GameState } from '../game/state';
import { GamePlayer } from '../game/player';

// components
import Board from '../components/Board';
import { useLocation, useNavigate } from 'react-router';

// a function for the computer players to play
const play = (player: GamePlayer, state: GameState) => {
  const start = Date.now();

  // compute the move
  const move = player.chooseMove!(state);

  // find the corresponding tile
  const tile = document.getElementsByClassName('small-board')[move.boardIndex]
    .children[move.tileIndex] as HTMLButtonElement;

  // click the tile
  setTimeout(() => tile.click(), Math.max(1000 - Date.now() + start, 0));
};

export default function Game() {
  const navigate = useNavigate();

  // fetch the game state
  const { state } = useLocation();

  if (!state) {
    navigate('/menu');
  }

  const { initialGameState, playerX, playerO } = state;
  console.log(initialGameState, playerX, playerO);

  if (!initialGameState || !playerX || !playerO) {
    navigate('/menu');
  }

  // initialize the game state
  const [gameState, setState] = useState(initialGameState);
  const player: GamePlayer = gameState.nextPlayer === 'X' ? playerX : playerO;
  const ongoing = gameState.validMoves.length > 0; // indicates if the game is still ongoing

  // a function for handling tile clicks
  const handleTileClick = (smallBoardIndex: number, tileIndex: number) => {
    if (gameState.makeMove(smallBoardIndex, tileIndex)) {
      setState(GameState.fromState(gameState));
    }
  };

  // handle computer player turns
  useEffect(() => {
    if (player.chooseMove && ongoing) {
      setTimeout(() => play(player, gameState), 0);
    }
  });

  // render the board
  return (
    <>
      <Board {...gameState} handleTileClick={handleTileClick} />
      <aside>
        {ongoing
          ? `It's your turn, ${gameState.nextPlayer}!`
          : gameState.winner
            ? `${gameState.winner} has won!`
            : `It's a tie!`}
      </aside>
    </>
  );
}
