import React, { useState } from 'react';

// components
import Board from './components/Board';
import Menu from './components/Menu';
import Credits from './components/Credits';

// styling
import './App.css';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'game' | 'credits'>('menu');
  
  const handleNewGame = () => {
    setCurrentScreen('game');
  };

  const showCredits = () => {
    setCurrentScreen('credits');
  };

  const returnToMenu = () => {
    setCurrentScreen('menu');
  };

  return (
    <div className="App">
      <title>Ultimate Cock Game</title>
      
      {currentScreen === 'menu' && (
        <Menu onNewGame={handleNewGame} onCredits={showCredits} />
      )}
      
      {currentScreen === 'game' && (
        <header className="App-header">
          <button 
            onClick={returnToMenu}
            className="back-button"
          >
            Back to Menu
          </button>
          <Board size={3} />
        </header>
      )}
      
      {currentScreen === 'credits' && (
        <Credits onBackToMenu={returnToMenu} />
      )}
    </div>
  );
}
