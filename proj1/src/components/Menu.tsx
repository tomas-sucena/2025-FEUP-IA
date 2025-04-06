import { Outlet } from 'react-router';

// assets
import Title from '../assets/title.svg';
import Logo from '../assets/logo.svg';

// styling
import './Menu.css';

export default function Menu() {
  return (
    <div className="menu">
      <img className="menu-title" src={Title} alt="Ultimate Tic-Tac-Toe" />
      <Outlet />
      <img className="menu-logo" src={Logo} alt="X and O" />
    </div>
  );
}
