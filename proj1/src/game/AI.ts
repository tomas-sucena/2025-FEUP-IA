import GameState, { Move } from './state';

export default class AI {
  chooseMove: (state: GameState) => Move;

  /**
   * Initializes the AI player.
   */
  constructor() {
    this.chooseMove = this.randomMove;
  }

  /**
   * Returns a random valid move.
   * @param state the game state
   * @returns a random valid move
   */
  randomMove(state: GameState): Move {
    const validMoves = state.getValidMoves();
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }
}
