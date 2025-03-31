import Logo from '../assets/logo.svg';

// styling
import './Menu.css';

export default function Menu() {
  return (
    <form id="menu">
      <img src={Logo} />
      <button>New Game</button>
      <button>Continue</button>
      <button>Credits</button>
      <p>Press any menu item to select</p>
    </form>
  );
}
