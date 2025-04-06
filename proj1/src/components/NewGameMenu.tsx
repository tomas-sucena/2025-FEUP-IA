import { useNavigate } from 'react-router';
import { GameState } from '../game/state';
import { GamePlayer } from '../game/player';

// components
import PlayerMenu from './PlayerMenu';

const parsePlayer = (data: FormData, symbol: string): GamePlayer => {
  const player = `player-${symbol}`;
  const name: string =
    data.get(`${player}-name`)?.toString() ?? `Player ${symbol}`;
  const type: string = data.get(`${player}-type`)!.toString();
  const depth: number = Number(data.get(`${player}-depth`)?.toString());

  return type === 'Human'
    ? GamePlayer.human(name, symbol)
    : GamePlayer.AI(name, symbol, depth);
};

export default function NewGameMenu() {
  const navigate = useNavigate();

  // a function to store the form data and redirect to the game
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // prevent the event from sending the request
    event.preventDefault();

    // fetch the form data
    const data = new FormData(event.currentTarget);

    // initialize the game variables
    const state = GameState.fromSize(Number(data.get('size')) || 3);
    const playerX = parsePlayer(data, 'X');
    const playerO = parsePlayer(data, 'O');

    // store the game variables
    localStorage.setItem('state', JSON.stringify(state));
    localStorage.setItem('player-X', JSON.stringify(playerX));
    localStorage.setItem('player-O', JSON.stringify(playerO));

    navigate('/game');
  };

  return (
    <>
      <form
        id="menu-new-game"
        className="menu-options"
        method="post"
        onSubmit={handleSubmit}
      >
        <label>
          Board Size
          <input type="number" name="size" placeholder="3" min="2" max="6" />
        </label>

        <PlayerMenu symbol={'X'} />
        <PlayerMenu symbol={'O'} />
      </form>
      <button form="menu-new-game" className="menu-button">
        Play
      </button>
    </>
  );
}
