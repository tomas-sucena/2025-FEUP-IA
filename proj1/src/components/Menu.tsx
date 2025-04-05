import { Outlet } from 'react-router';

// assets
import Logo from '../assets/logo.svg';

// styling
import './Menu.css';

export default function Menu() {
  return (
    <div className="menu">
      <img className="menu-title" src={Logo} alt="Ultimate Tic-Tac-Toe" />
      <Outlet />
    </div>
  );
}
