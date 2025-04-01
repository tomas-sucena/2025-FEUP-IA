import { useState } from 'react';
import { GameAI } from '../game/AI';

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
  // TODO: add header and footer
  return (
    <>
      <title>Ultimate Tic-Tac-Toe</title>
      <main>
        <Game size={3} player2={GameAI.medium()} />
      </main>
    </>
  );
}
