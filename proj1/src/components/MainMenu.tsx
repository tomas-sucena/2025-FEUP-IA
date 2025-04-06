import { useRef } from 'react';
import { Link, useNavigate } from 'react-router';

/**
 * The main menu.
 * @returns the main menu
 */
export default function MainMenu() {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const options = [
    { label: 'New Game', route: '/menu/new-game' },
    { label: 'Continue', route: '/game' },
    {
      label: 'Load Game',
      action: () => fileInput.current?.click(),
    },
    {
      label: 'Rules',
      route: 'https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe',
    },
  ];

  // a function for loading the game state from a file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // ensure the file exists
    if (file) {
      // read the file
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const fileContent = reader.result;

          if (typeof fileContent === 'string') {
            localStorage.setItem('Ultimate Tic-Tac-Toe', fileContent);
            navigate('/game');
          }
        } catch (error) {
          console.error('Error reading file: ', error);
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <>
      <ul className="menu-options">
        {options.map((option) => (
          <li key={`menu-button-${option.label}`} className="menu-button">
            {option.route ? (
              <Link to={option.route}>{option.label}</Link>
            ) : (
              <button onClick={option.action}>{option.label}</button>
            )}
          </li>
        ))}
      </ul>
      <small>Press any menu item to select</small>

      <input
        hidden
        type="file"
        accept="application/json"
        ref={fileInput}
        onChange={handleFileChange}
      />
    </>
  );
}
