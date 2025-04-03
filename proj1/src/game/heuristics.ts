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
    return Weight.Max * +(state.winner === move.player);
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
      +state.validMoves.some((move) => {
        return GameState.fromState(state, move).winner === state.nextPlayer;
      })
    );
  },
  /**
   * Determines if the player has won the small board they played on.
   * @param state the game state
   * @param move the move
   * @returns boolean indicating if the player has won the small board they played on
   */
  smallBoardWin: (state: GameState, move: GameMove): number => {
    return Weight.A_lot * +(state.board[move.boardIndex] === move.player);
  },
  /**
   * Determines if the opponent can win a small board in the next turn.
   * @param state the game state
   * @param move the move
   * @returns boolean indicating if the opponent can win a small board in the next turn
   */
  smallBoardLoss: (state: GameState, _: GameMove): number => {
    return (
      -Weight.A_lot *
      +state.validMoves.some((move) => {
        return GameState.fromState(state, move).board.some(
          (winner, smallBoardIndex) => winner !== state.board[smallBoardIndex],
        );
      })
    );
  },
  /**
   * Determines if the opponent will not be restricted to a small board in the next turn.
   * @param state the game state
   * @param _ the move
   * @returns boolean indicating if the opponent will not be restricted to a small board in the next turn
   */
  avoidFreeMove: (state: GameState, _: GameMove): number => {
    return -Weight.Average * +(state.nextBoardIndex < 0);
  },
  /**
   * Determines if the current move blocks a diagonal occupied by the opponent.
   * @param state the game state
   * @param move the move
   * @returns boolean indicating if the current move blocks a diagonal occupied by the opponent
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
      Weight.A_little * +(index >= 0 && smallBoard[oppositeCorners[index]] === state.nextPlayer)
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
