import { GameState, GameMove } from './state';

enum Weight {
  Max = 1_000_000,
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

  return victoryPatterns.reduce((acc, pattern) => acc + countSymbols(pattern), 0);
};

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
   * Determines if the opponent has won the game.
   * @param state the game state
   * @param opponent the opponent
   * @returns true if the opponent has lost the game, false otherwise
   */
  loss: ({ state, opponent }: IHeuristic): number => {
    return -Weight.Max * +(state.winner === opponent);
  },
  evalutateBigBoard: ({ state, player, opponent }: IHeuristic): number => {
    return (
      evaluateBoard(state.board, player, opponent, state.victoryPatterns) -
      evaluateBoard(state.board, opponent, player, state.victoryPatterns)
    );
  },
  evalutateSmallBoards: ({ state, player, opponent }: IHeuristic): number => {
    return state.smallBoards.reduce(
      (acc, smallBoard) =>
        acc +
        evaluateBoard(smallBoard, player, opponent, state.victoryPatterns) -
        evaluateBoard(smallBoard, opponent, player, state.victoryPatterns),
      0,
    );
  },
};
