import { Outlet } from 'react-router';

// assets
import Logo from '../assets/logo.svg';

// styling
import './Menu.css';

export default function Menu() {
  return (
    <form id="menu">
      <img id="menu-title" src={Logo} alt="Ultimate Tic-Tac-Toe" />
      <Outlet />
      <small>Press any menu item to select</small>
    </form>
  );
}
