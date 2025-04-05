import { GameAI } from '../game/AI';
import { useState } from 'react';

// components
import Menu from './Menu';

// styling
import './App.css';

export default function App() {
  const [content, setContent] = useState(<Menu />);

  return (
    <>
      <title>Ultimate Tic-Tac-Toe</title>
      <main>{content}</main>
    </>
  );
}
