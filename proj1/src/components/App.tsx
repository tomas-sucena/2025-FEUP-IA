import { useState } from 'react';
import { GameAI } from '../game/AI';

// components
import Game from './Game';
import Menu from './Menu';

// styling
import './App.css';

enum Page {
  Menu,
  Game,
  Credits,
}

export default function App() {
  const [page, setPage] = useState(Page.Menu);

  // a function for going back to the menu
  // const goToMenu = () => setPage(Page.Menu);

  // TODO: add header and footer
  return (
    <>
      <title>Ultimate Tic-Tac-Toe</title>
      <main>
        {page === Page.Menu && <Menu />}
        {page === Page.Game && <Game size={3} player2={GameAI.easy()} />}
      </main>
    </>
  );
}
