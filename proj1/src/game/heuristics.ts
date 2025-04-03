import { GameState, GameMove } from './state';

enum Weight {
  Max = 1000,
  A_lot = 500,
  Average = 50,
  A_little = 30,
  Min = 10,
}

export const heuristics = {
  /**
   * Determines if the player has won the game.
   * @param state the game state
   * @param move the move
   * @returns true if the player has won the game, false otherwise
   */
  win: (state: GameState, move: GameMove): number => {
    return Weight.Max * +state.checkWinner(state.board, move.player);
  },
  /**
   * Determines if the opponent can win the game in the next turn.
   * @param state the game state
   * @param move the move
   * @returns true if the opponent can win the game in the next turn, false otherwise
   */
  loss: (state: GameState, _: GameMove): number => {
    return (
      -Weight.Max *
      +state.getValidMoves().some((move) => {
        const nextState = GameState.fromState(state);
        nextState.makeMove(move.boardIndex, move.tileIndex);

        return nextState.checkWinner(nextState.board, state.nextPlayer);
      })
    );
  },
  /**
   * Determines if the player has won the small board they played on.
   * @param state the game state
   * @param move the move
   * @returns true if the player has won the small board they played on, false otherwise
   */
  smallBoardWin: (state: GameState, move: GameMove): number => {
    return Weight.A_lot * +(state.board[move.boardIndex] === move.player);
  },
  /**
   * Determines if the opponent can win a small board in the next turn.
   * @param state the game state
   * @param move the move
   * @returns true if the opponent can win a small board in the next turn, false otherwise
   */
  smallBoardLoss: (state: GameState, _: GameMove): number => {
    return (
      -Weight.A_lot *
      +state.getValidMoves().some((move) => {
        const nextState = GameState.fromState(state);
        nextState.makeMove(move.boardIndex, move.tileIndex);

        return state.board.some(
          (winner, smallBoardIndex) =>
            winner !== nextState.board[smallBoardIndex],
        );
      })
    );
  },
  avoidFreeMove: (state: GameState, _: GameMove): number => {
    return -Weight.Average * +(state.nextBoardIndex < 0);
  },
  /**
   * Determines if the current move blocks a diagonal occupied by the opponent.
   * @param state the game state
   * @param move the move
   * @returns true if the current move blocks a diagonal occupied by the opponent, false otherwise
   */
  blockOppositeCorner: (state: GameState, move: GameMove): number => {
    const smallBoard = state.smallBoards[move.boardIndex];

    // compute the corners
    const corners = [
      0, // top left
      state.size - 1, // top right
      smallBoard.length - state.size, // bottom left
      smallBoard.length - 1, // bottom right
    ];
    const oppositeCorners = corners.toReversed();

    // determine if the player occupied a corner
    const index = corners.indexOf(move.tileIndex);

    return (
      Weight.A_little *
      +(index >= 0 && smallBoard[oppositeCorners[index]] === state.nextPlayer)
    );
  },
  /**
   * Counts the number of non-blocked victory patterns that contain the move.
   * @param state the game state
   * @param move the move
   * @returns the number of victory patterns that contain the move
   */
  countNonBlockedPatterns: (state: GameState, move: GameMove): number => {
    const smallBoard = state.smallBoards[move.boardIndex];

    return (
      Weight.Min *
      state.victoryPatterns.reduce(
        (acc, pattern) =>
          acc +
          +(
            pattern.includes(move.tileIndex) &&
            pattern.every((index) => smallBoard[index] !== state.nextPlayer)
          ),
        0,
      )
    );
  },
};
