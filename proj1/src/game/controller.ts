import GameState from './state';

export default class GameController {
  victoryPatterns: number[][]; // an array containing all possible tile combinations that lead to victory

  /**
   * Initializes a game controller.
   * @param size the number of rows and columns of the board
   */
  constructor(size: number) {
    const area = size * size;

    // initialize the victory patterns
    this.victoryPatterns = [];

    // rows
    for (let i = 0; i < area; i += size) {
      this.victoryPatterns.push(Array.from({ length: size }, (_, j) => i + j));
    }

    // columns
    for (let j = 0; j < area; j += size) {
      this.victoryPatterns.push(
        Array.from({ length: size }, (_, i) => i + j * size),
      );
    }

    // diagonals
    this.victoryPatterns.push(
      Array.from({ length: size }, (_, i) => i * size + i),
    );
    this.victoryPatterns.push(
      Array.from({ length: size }, (_, i) => area - (i * size + i + 1)),
    );
  }

  checkWinner(board: string[], player: string) {
    return this.victoryPatterns.some((pattern) =>
      pattern.every((i) => board[i] === player),
    );
  }

  /**
   * Verifies if a move is valid and, if it its, updates the state accordingly.
   * @param state the game state
   * @param boardIndex the index of the small board
   * @param tileIndex the index of the tile
   * @returns true if the move is valid, false otherwise
   */
  isValidMove(
    state: GameState,
    boardIndex: number,
    tileIndex: number,
  ): boolean {
    return (
      state.nextBoardIndex < 0 ||
      (state.nextBoardIndex === boardIndex &&
        state.boards[boardIndex] === '' &&
        state.tiles[boardIndex][tileIndex] === '')
    );
  }

  /**
   * Verifies if a move is valid and, if it its, updates the state accordingly.
   * @param state the game state
   * @param boardIndex the index of the small board
   * @param tileIndex the index of the tile
   * @returns true if the move was made, false otherwise
   */
  makeMove(state: GameState, boardIndex: number, tileIndex: number): boolean {
    // verify if the move is valid
    if (!this.isValidMove(state, boardIndex, tileIndex)) {
      return false;
    }

    const smallBoard = state.tiles[boardIndex];
    smallBoard[tileIndex] = state.nextPlayer;

    // verify if the player won the small board
    if (this.checkWinner(smallBoard, state.nextPlayer)) {
      state.boards[boardIndex] = state.nextPlayer;
    }

    // toggle the player
    state.nextPlayer = state.nextPlayer === 'X' ? 'O' : 'X';

    // switch the board
    state.nextBoardIndex = state.boards[tileIndex] ? -1 : tileIndex;

    return true;
  }
}
