import { Form, Link } from 'react-router';

const PlayerMenu = () => {
  const typeOptions = [
    { label: 'Human', value: false },
    { label: 'AI', value: true },
  ];

  return (
    <fieldset>
      <legend>Player</legend>
      <select name="isAI">
        {typeOptions.map((option) => (
          <option value="">{option.label}</option>
        ))}
      </select>
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
    <form method="post">
      <label>Board Size:</label>
      <input type="number" name="size" placeholder="3" min="2" max="5" />
    </form>
  );
}
