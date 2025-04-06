import { Navigate } from 'react-router';
import { GameState } from '../game/state';
import { GamePlayer } from '../game/player';

// components
import Game from './Game';

const loadGame = () => {
  // fetch the data
  const data = JSON.parse(localStorage.getItem('Ultimate Tic-Tac-Toe') ?? '{}');

  if (!data['gameState'] || !data['playerX'] || !data['playerO']) {
    console.warn('No save data was found.');
    return null;
  }

  // parse the game state
  try {
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
