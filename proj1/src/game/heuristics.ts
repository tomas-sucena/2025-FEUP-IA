import { GameState, GameMove } from './state';

enum Weight {
  Max = 1000,
  A_lot = 500,
  Average = 50,
  A_little = 30,
  Min = 10,
}

interface IHeuristic {
  state: GameState;
  move: GameMove;
  player: string;
  opponent: string;
}

export const heuristics = {
  /**
   * Determines if the player has won the game.
   * @param state the game state
   * @param player the player
   * @returns true if the player has won the game, false otherwise
   */
  win: ({ state, player }: IHeuristic): number => {
    return Weight.Max * +(state.winner === player);
  },
  /**
   * Determines if the opponent can win the game in the next turn.
   * @param state the game state
   * @param move the move
   * @returns true if the opponent can win the game in the next turn, false otherwise
   */
  loss: ({ state, opponent }: IHeuristic): number => {
    return -Weight.Max * +(state.winner === opponent);
  },
  /**
   * Determines if the player has won the small board they played on.
   * @param state the game state
   * @param move the move
   * @returns boolean indicating if the player has won the small board they played on
   */
  smallBoardWin: ({ state, move, player }: IHeuristic): number => {
    return Weight.A_lot * +(state.board[move.boardIndex] === player);
  },
  /**
   * Determines if the opponent can win a small board in the next turn.
   * @param state the game state
   * @param move the move
   * @returns boolean indicating if the opponent can win a small board in the next turn
   */
  smallBoardLoss: ({ state, move, opponent }: IHeuristic): number => {
    return Weight.A_lot * +(state.board[move.boardIndex] === opponent);
  },
  /**
   * Determines if the opponent will not be restricted to a small board in the next turn.
   * @param state the game state
   * @returns boolean indicating if the opponent will not be restricted to a small board in the next turn
   */
  /*avoidFreeMove: ({ state, player }: IHeuristic): number => {
    return -Weight.Average * +(state.nextBoardIndex < 0);
  },*/
  blockOpponentPatterns: ({ state, move, opponent }: IHeuristic) => {
    const smallBoard = state.smallBoards[move.boardIndex];

    // a function that counts the number of symbols in a pattern
    const countSymbols = (pattern: number[], symbol: string) => {
      return pattern.reduce((acc, index) => acc + +(smallBoard[index] === symbol), 0);
    };

    return (
      Weight.Average *
      state.victoryPatterns.reduce(
        (acc, pattern) =>
          acc +
          +(pattern.includes(move.tileIndex) && countSymbols(pattern, opponent) === state.size - 1),
        0,
      )
    );
  },
  /**
   * Determines if the current move blocks a diagonal occupied by the opponent.
   * @param state the game state
   * @param move the move
   * @returns boolean indicating if the current move blocks a diagonal occupied by the opponent
   */
  blockOppositeCorner: ({ state, move, opponent }: IHeuristic): number => {
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

    return Weight.A_little * +(index >= 0 && smallBoard[oppositeCorners[index]] === opponent);
  },
  /**
   * Counts the number of non-blocked victory patterns that contain the move.
   * @param state the game state
   * @param move the move
   * @returns the number of victory patterns that contain the move
   */
  countNonBlockedPatterns: ({ state, move, player }: IHeuristic): number => {
    const smallBoard = state.smallBoards[move.boardIndex];

    return (
      Weight.Min *
      state.victoryPatterns.reduce(
        (acc, pattern) =>
          acc +
          +(
            pattern.includes(move.tileIndex) &&
            pattern.every((index) => smallBoard[index] !== player)
          ),
        0,
      )
    );
  },
};
