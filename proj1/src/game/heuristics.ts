import { GameState, GameMove } from './state';

enum Weight {
  Max = 1000,
  A_lot = 500,
  Average = 50,
  A_little = 10,
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
    // a function that determines if the player can win the small board
    const canWinSmallBoard = (smallBoard: string[], boardIndex: number) => {
      return (
        state.board[boardIndex] === '' &&
        state.victoryPatterns.some(
          (pattern) =>
            pattern.reduce(
              (acc, index) => acc + +(smallBoard[index] === state.nextPlayer),
              0,
            ) === 2,
        )
      );
    };

    return (
      -Weight.A_lot *
      +(state.nextBoardIndex < 0
        ? state.smallBoards.map((smallBoard, boardIndex) =>
            canWinSmallBoard(smallBoard, boardIndex),
          ) // all small boards are available
        : canWinSmallBoard(
            state.smallBoards[state.nextBoardIndex],
            state.nextBoardIndex,
          )) // only a specific small board is available
    );
  },
  avoidFreeMove: (state: GameState, _: GameMove): number => {
    return -Weight.Average * +(state.nextBoardIndex < 0);
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
      Weight.A_little *
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
