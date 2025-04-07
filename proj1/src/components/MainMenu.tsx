import { useRef } from 'react';
import { Link, useNavigate } from 'react-router';

/**
 * The main menu.
 * @returns the main menu
 */
export default function MainMenu() {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);

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
      <nav className="menu-options">
        <Link className="menu-button" to="/menu/new-game">
          New Game
        </Link>
        {localStorage.getItem('Ultimate Tic-Tac-Toe') !== null && (
          <Link className="menu-button" to="/game">
            Continue
          </Link>
        )}
        <button
          className="menu-button"
          onClick={() => fileInput.current?.click()}
        >
          Load Game
        </button>
        <Link
          className="menu-button"
          to="https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe"
          target="_blank"
        >
          Rules
        </Link>
      </nav>

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
