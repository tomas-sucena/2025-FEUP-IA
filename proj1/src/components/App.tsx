import { BrowserRouter, Navigate, Routes, Route } from 'react-router';

// components
import Game from './Game';
import MainMenu from '../pages/MainMenu';
import Menu from './Menu';
import NewGameMenu from '../pages/NewGameMenu';

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

          <Route path="game" element={<Game size={2} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
