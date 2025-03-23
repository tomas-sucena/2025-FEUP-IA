import React, { useState, useEffect} from 'react';
import GameState from './game/state';

// components
import Board from './components/Board';
import Menu from './components/Menu';
import Credits from './components/Credits';

// styling
import './App.css';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'menu' | 'game' | 'credits'>('menu');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [hasExistingGame, setHasExistingGame] = useState(false);

  // Check for existing game on load
  useEffect(() => {
    const savedGame = localStorage.getItem('savedGameState');
    if (savedGame) {
      try {
        const parsedState = JSON.parse(savedGame);
        // Check if it's a valid game state
        if (parsedState.boards && parsedState.tiles && parsedState.nextPlayer !== undefined) {
          setHasExistingGame(true);
        }
      } catch (e) {
        console.error("Error parsing saved game:", e);
        localStorage.removeItem('savedGameState');
      }
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (gameState && currentScreen === 'game') {
      localStorage.setItem('savedGameState', JSON.stringify(gameState));
      setHasExistingGame(true);
    }
  }, [gameState, currentScreen]);
  
  const handleNewGame = () => {
    setGameState(new GameState({ size: 3 }));
    setCurrentScreen('game');
  };

  const handleContinue = () => {
    try {
      const savedGame = localStorage.getItem('savedGameState');
      if (savedGame) {
        const parsedState = JSON.parse(savedGame);
        setGameState(new GameState(parsedState));
        setCurrentScreen('game');
      }
    } catch (e) {
      console.error("Error loading saved game:", e);
      handleNewGame(); // Fallback to new game if loading fails
    }
  };

  const showCredits = () => {
    setCurrentScreen('credits');
  };

  const returnToMenu = () => {
    // Save the current game state before returning to menu
    if (currentScreen === 'game' && gameState) {
      localStorage.setItem('savedGameState', JSON.stringify(gameState));
    }
    setCurrentScreen('menu');
  };

  // Update the game state when a move is made
  const handleGameStateUpdate = (newState: GameState) => {
    setGameState(new GameState(newState));
  };

  return (
    <div className="App">
      <title>Ultimate Cock Game</title>
      
      {currentScreen === 'menu' && (
        <Menu 
          onNewGame={handleNewGame} 
          onContinue={handleContinue} 
          onCredits={showCredits}
          hasExistingGame={hasExistingGame} 
        />
      )}
      
      {currentScreen === 'game' && gameState && (
        <header className="App-header">
          <button 
            onClick={returnToMenu}
            className="back-button"
          >
            Back to Menu
          </button>
          <Board 
            size={3} 
            initialState={gameState}
            onStateChange={handleGameStateUpdate}
          />
        </header>
      )}
      
      {currentScreen === 'credits' && (
        <Credits onBackToMenu={returnToMenu} />
      )}
    </div>
  );
}