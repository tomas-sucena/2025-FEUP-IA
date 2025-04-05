import { useState } from 'react';

// a menu for configuring the players
const PlayerMenu = ({ player }: { player: number }) => {
  const typeOptions = ['Human', 'AI'];
  const difficultyOptions = [
    { label: 'Random', depth: 0 },
    { label: 'Easy', depth: 1 },
    { label: 'Medium', depth: 3 },
    { label: 'Hard', depth: 5 },
  ];

  // initialize the state
  const [playerType, setPlayerType] = useState('Human');

  return (
    <fieldset>
      <legend>Player {player}</legend>

      <label>
        Type
        <select
          id={`player-${player}-type`}
          name="type"
          value={playerType}
          onChange={(event) => setPlayerType(event.target.value)}
          required
        >
          {typeOptions.map((option) => (
            <option key={`type-${option}`} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      {playerType === 'AI' && (
        <label>
          Difficulty
          <select id={`player-${player}-difficulty`} name="difficulty">
            {difficultyOptions.map((option) => (
              <option key={`difficulty-${option.depth}`} value={option.depth}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )}
    </fieldset>
  );
};

export default function NewGameMenu() {
  const options = [
    { label: 'New Game', route: '/new-game' },
    { label: 'Continue', route: '/game' },
    { label: 'Load Game', action: () => {} },
    { label: 'Credits', route: '/new-game' },
  ];

  return (
    <form className="menu-options" method="post">
      <label>
        Board Size
        <input type="number" name="size" placeholder="3" min="2" max="6" />
      </label>

      <PlayerMenu player={1} />
      <PlayerMenu player={2} />
    </form>
  );
}
