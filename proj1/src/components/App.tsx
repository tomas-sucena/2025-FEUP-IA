import { BrowserRouter, Navigate, Routes, Route } from 'react-router';

// components
import GameLoader from './GameLoader';
import MainMenu from './MainMenu';
import NewGameMenu from './NewGameMenu';
import Menu from './Menu';

// styling
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <title>Ultimate Tic-Tac-Toe</title>
      <main>
        <Routes>
          <Route index element={<Navigate to="/menu" replace={true} />} />

          <Route path="menu" element={<Menu />}>
            <Route index element={<MainMenu />} />
            <Route path="new-game" element={<NewGameMenu />} />
          </Route>

          <Route path="game" element={<GameLoader />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
