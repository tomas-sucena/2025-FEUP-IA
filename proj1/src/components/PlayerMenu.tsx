import { useState } from 'react';

/**
 * Renders a menu with options for configuring a player.
 * @param symbol the player's symbol
 * @returns a menu with options for configuring a player
 */
export default function PlayerMenu({ symbol }: { symbol: string }) {
  const typeOptions = ['Human', 'AI'];
  const difficultyOptions = [
    { label: 'Random', difficulty: 0 },
    { label: 'Easy', difficulty: 1 },
    { label: 'Medium', difficulty: 2 },
    { label: 'Hard', difficulty: 3 },
  ];

  // initialize the state
  const [playerType, setPlayerType] = useState('Human');

  return (
    <fieldset>
      <legend>Player {symbol}</legend>

      <label>
        Name
        <input
          name={`player-${symbol}-name`}
          type="text"
          placeholder={`Player ${symbol}`}
        />
      </label>

      <label>
        Type
        <select
          name={`player-${symbol}-type`}
          value={playerType}
          onChange={(event) => setPlayerType(event.target.value)}
          required
        >
          {typeOptions.map((option) => (
            <option key={`player-type-${option}`} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      {playerType === 'AI' && (
        <label>
          Difficulty
          <select name={`player-${symbol}-difficulty`}>
            {difficultyOptions.map((option) => (
              <option
                key={`player-difficulty-${option.label}`}
                value={option.difficulty}
              >
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )}
    </fieldset>
  );
}
