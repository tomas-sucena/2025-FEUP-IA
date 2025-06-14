import { Navigate } from 'react-router';
import { GameState } from '../game/state';
import { GamePlayer } from '../game/player';

// components
import Game from './Game';

export const serializeGame = (
  state: GameState,
  playerX: GamePlayer,
  playerO: GamePlayer,
) => {
  return JSON.stringify({
    gameState: JSON.stringify(state),
    playerX: JSON.stringify(playerX),
    playerO: JSON.stringify(playerO),
  });
};

export const saveGame = (
  state: GameState,
  playerX: GamePlayer,
  playerO: GamePlayer,
) => {
  // save the data on the browser's local storage
  localStorage.setItem(
    'Ultimate Tic-Tac-Toe',
    serializeGame(state, playerX, playerO),
  );
};

// A function that loads the saved game data, if any.
const loadGame = () => {
  try {
    // fetch the data
    const data = JSON.parse(
      localStorage.getItem('Ultimate Tic-Tac-Toe') ?? '{}',
    );

    if (!data['gameState'] || !data['playerX'] || !data['playerO']) {
      console.warn('No save data was found.');
      return null;
    }

    // parse the game state
    const gameState = new GameState(JSON.parse(data['gameState']));
    const playerX = new GamePlayer(JSON.parse(data['playerX']));
    const playerO = new GamePlayer(JSON.parse(data['playerO']));

    return { initialState: gameState, playerX, playerO };
  } catch (e) {
    console.error('Invalid save data.');
    return null;
  }
};

export default function GameLoader() {
  // verify if the save data exists
  const saveData = loadGame();

  return saveData ? (
    <Game {...saveData} />
  ) : (
    <Navigate to="/menu" replace={true} />
  );
}
