import Logo from '../assets/logo.svg';

// styling
import './Menu.css';

export default function Menu() {
  return (
    <form id="menu">
      <img id="menu-title" src={Logo} alt="Ultimate Tic-Tac-Toe" />
      <ul id="menu-options">
        <li>
          <button>New Game</button>
        </li>
        <li>
          <button>Continue</button>
        </li>
        <li>
          <button>Credits</button>
        </li>
      </ul>
      <small>Press any menu item to select</small>
    </form>
  );
}
