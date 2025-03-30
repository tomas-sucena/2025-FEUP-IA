import { useState } from 'react';

// components
import Game from './Game';

// styling
import './App.css';

enum Page {
  Menu,
  Game,
  Credits,
}

export default function App() {
  const [page, setPage] = useState(Page.Game);

  // a function for going back to the menu
  // const goToMenu = () => setPage(Page.Menu);

  // TODO: add header and footer
  return (
    <>
      <title>Ultimate Tic-Tac-Toe</title>
      <main>{page === Page.Game && <Game size={3} />}</main>
    </>
  );
}
