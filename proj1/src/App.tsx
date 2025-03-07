// components
import Board from './components/Board';

// styling
import './App.css';

export default function App() {
  return (
    <div className="App">
      <title>Ultimate Tic-Tac-Toe</title>
      <header className="App-header">
        <Board rows={3} columns={3} />
      </header>
    </div>
  );
}
