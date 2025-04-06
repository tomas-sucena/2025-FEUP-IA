import { GameState, GameMove } from './state';

enum Weight {
  Max = 1_000_000,
  A_lot_more = 3000,
  A_lot = 1000,
  Average = 500,
  A_little_more = 30,
  A_little = 10,
}

interface IHeuristic {
  state: GameState;
  move: GameMove;
  player: string;
  opponent: string;
}

export type Heuristic = (data: IHeuristic) => number;

/**
 * Counts the number of board tiles that belong to non-blocked victory patterns.
 * @param board the board
 * @param player the player's symbol
 * @param opponent the opponent's symbol
 * @param victoryPatterns the victory patterns
 * @returns the number of board tiles that belong to non-blocked victory patterns
 */
const evaluateBoard = (
  board: string[],
  player: string,
  opponent: string,
  victoryPatterns: number[][],
): number => {
  // a function to count the number of symbols
  const countSymbols = (pattern: number[]): number => {
    let counter = 0;

    for (const index of pattern) {
      const symbol = board[index];

      // verify if the pattern is blocked
      if (symbol === opponent) {
        return 0;
      }

      counter += +(symbol === player);
    }

    return counter;
  };

  return victoryPatterns.reduce(
    (acc, pattern) => acc + countSymbols(pattern),
    0,
  );
};

export const heuristics = {
  /**
   * Determines if the player has won the game.
   * @param state the game state
   * @param player the player
   * @returns a heuristic value indicating if the player has won the game
   */
  win: ({ state, player }: IHeuristic): number => {
    return Weight.Max * +(state.winner === player);
  },
  /**
   * Determines if the opponent has won the game.
   * @param state the game state
   * @param opponent the opponent
   * @returns a heuristic value indicating if the opponent has won the game
   */
  loss: ({ state, opponent }: IHeuristic): number => {
    return -Weight.Max * +(state.winner === opponent);
  },
  /**
   * Determines if the opponent can choose the small board where they will play.
   * @param state the game state
   * @param player the player
   * @returns a heuristic value indicating if the opponent can choose the small board where they will play
   */
  avoidFreeMove: ({ state, player }: IHeuristic): number => {
    return (
      Weight.Average *
      +(state.nextSmallBoardIndex < 0 && (state.nextPlayer === player ? 1 : -1))
    );
  },
  /**
   * Determines if the current state favors the player by evaluating the big board.
   * @param state the game state
   * @param player the player
   * @param opponent the opponent
   * @returns a heuristic value indicating if the current state favors the player
   */
  evaluateBigBoard: ({ state, player, opponent }: IHeuristic): number => {
    return (
      Weight.A_lot *
        evaluateBoard(state.board, player, opponent, state.victoryPatterns) -
      Weight.A_lot_more *
        evaluateBoard(state.board, opponent, player, state.victoryPatterns)
    );
  },
  /**
   * Determines if the current state favors the player by evaluating the small boards.
   * @param state the game state
   * @param player the player
   * @param opponent the opponent
   * @returns a heuristic value indicating if the current state favors the player
   */
  evaluateSmallBoards: ({ state, player, opponent }: IHeuristic): number => {
    return state.smallBoards
      .filter((_, smallBoardIndex) => state.board[smallBoardIndex] === '')
      .reduce(
        (acc, smallBoard) =>
          acc +
          Weight.A_little *
            evaluateBoard(smallBoard, player, opponent, state.victoryPatterns) -
          Weight.A_little_more *
            evaluateBoard(smallBoard, opponent, player, state.victoryPatterns),
        0,
      );
  },
};
