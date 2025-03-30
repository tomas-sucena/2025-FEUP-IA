import { GameState, GameMove } from './state';

export default {
  /**
   * Counts the number of victory patterns that contain the move.
   * @param state the game state
   * @param move the move
   * @returns the number of victory patterns that contain the move
   */
  countPatterns: (state: GameState, move: GameMove) => {
    state.victoryPatterns.reduce(
      (acc, pattern) => acc + +pattern.includes(move[1]),
      0,
    );
  },
};
