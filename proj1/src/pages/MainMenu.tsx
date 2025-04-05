import { Link } from 'react-router';

export default function MainMenu() {
  const options = [
    { label: 'New Game', route: '/menu/new-game' },
    { label: 'Continue', route: '/game' },
    { label: 'Load Game', action: () => {} },
    { label: 'Credits', route: '/new-game' },
  ];

  return (
    <>
      <ul className="menu-options">
        {options.map((option) => (
          <li className="menu-button">
            {option.route ? (
              <Link to={option.route}>{option.label}</Link>
            ) : (
              <button onClick={option.action}>{option.label}</button>
            )}
          </li>
        ))}
      </ul>
      <small>Press any menu item to select</small>
    </>
  );
}
