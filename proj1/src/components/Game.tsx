import { useState } from 'react';
import { GameState } from '../game/state';

// components
import Board from './Board';
import Tile from './Tile';

export default function Game({ size }: { size: number }) {
  // initialize the game state
  const [state, setState] = useState(GameState.fromSize(size));

  // a function for handling tile clicks
  const onTileClick = (boardIndex: number, tileIndex: number) => {
    if (state.makeMove(boardIndex, tileIndex)) {
      setState(GameState.fromState(state));
    }
  };

  // render the small boards
  const smallBoards = state.smallBoards.map((smallBoard, smallBoardIndex) =>
    smallBoard.map((tile, tileIndex) => (
      <Tile
        key={tileIndex}
        symbol={tile}
        onClick={onTileClick.bind(null, smallBoardIndex, tileIndex)}
      />
    )),
  );

  // set the dimensions of the board in CSS
  (document.getElementById('app') as HTMLElement).style.setProperty(
    '--size',
    size.toString(),
  );

  // render the board
  return <Board>{smallBoards}</Board>;
}
