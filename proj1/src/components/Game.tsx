import { useEffect, useState } from 'react';
import { GameState } from '../game/state';
import { GamePlayer } from '../game/player';

// assets
import DownloadButton from '../assets/download-button.svg';

// components
import Board from '../components/Board';
import { saveGame, serializeGame } from './GameLoader';

// styling
import './Game.css';

interface GameProps {
  /** the initial game state */
  initialState: GameState;
  /** the player whose symbol is X */
  playerX: GamePlayer;
  /** the player whose symbol is O */
  playerO: GamePlayer;
}

/**
 * Creates an URL for downloading the game state.
 * @param state the game state
 * @param playerX the player whose symbol is X
 * @param playerO the player whose symbol is O
 * @returns an URL for downloading the game state
 */
const getDownloadURL = (
  state: GameState,
  playerX: GamePlayer,
  playerO: GamePlayer,
) => {
  // serialize the game state
  const jsonData = serializeGame(state, playerX, playerO);

  // create the URL
  return `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
};

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

/**
 * The game view.
 * @param initialState the initial game state
 * @param playerX the player whose symbol is X
 * @param playerO the player whose symbol is O
 * @returns the game view
 */
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
      setTimeout(() => play(player, state), 5);
    }

    // save the game
    saveGame(state, playerX, playerO);
  });

  return (
    <>
      <a
        className="download-button"
        href={getDownloadURL(state, playerX, playerO)}
        download="game_state.json"
      >
        <img src={DownloadButton} alt="Download button" />
      </a>
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
